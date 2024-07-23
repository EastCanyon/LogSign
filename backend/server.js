const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const envPath = path.join(__dirname, "../.env");
const envConfig = fs.readFileSync(envPath, "utf8");

envConfig.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

console.log("Naver Client ID:", process.env.NAVER_CLIENT_ID);
console.log("Naver Client Secret:", process.env.NAVER_CLIENT_SECRET);
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("Kakao Client ID:", process.env.KAKAO_CLIENT_ID);
console.log("Kakao Client Secret:", process.env.KAKAO_CLIENT_SECRET);

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const NaverStrategy = require("passport-naver").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const cors = require("cors");
const User = require("./models/User");
const crypto = require("crypto");

const app = express();
const port = 3000;

// Nodemailer 설정
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

// 세션 설정
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// 네이버 전략 설정
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/naver/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        console.log("Naver Profile:", profile);
        let user = await User.findOne({ naverId: profile.id });
        if (!user) {
          user = new User({
            naverId: profile.id,
            username: profile.emails[0].value,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        } else {
          user.displayName = profile.displayName;
          user.email = profile.emails[0].value;
          await user.save();
        }
        console.log("User found or created:", user);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 구글 전략 설정
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        console.log("Google Profile:", profile);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.emails[0].value,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        } else {
          user.displayName = profile.displayName;
          user.email = profile.emails[0].value;
          await user.save();
        }
        console.log("User found or created:", user);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 카카오 전략 설정
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/kakao/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        console.log("Kakao Profile:", profile);
        let user = await User.findOne({ kakaoId: profile.id });
        const email =
          profile._json &&
          profile._json.kakao_account &&
          profile._json.kakao_account.email
            ? profile._json.kakao_account.email
            : `kakao_${profile.id}@example.com`;

        if (!user) {
          user = new User({
            kakaoId: profile.id,
            username: `kakao_${profile.id}`,
            displayName: profile.displayName,
            email: email,
          });
          await user.save();
        } else {
          user.displayName = profile.displayName;
          user.email = email;
          await user.save();
        }
        console.log("User found or created:", user);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 직렬화 및 역직렬화 함수 설정
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// API 엔드포인트 설정
app.post("/api/register", (req, res) => {
  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: "User registered successfully!" });
    }
  );
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Logged in successfully!" });
    });
  })(req, res, next);
});

app.post("/api/check-nickname", async (req, res) => {
  const { nickname } = req.body;
  const user = await User.findOne({ username: nickname });
  res.json({ exists: !!user });
});

app.post("/api/check-email", async (req, res) => {
  const { email } = req.body;
  console.log("Received email to check:", email); // 디버깅용 로그 추가
  const user = await User.findOne({ email });
  console.log("User found:", user); // 디버깅용 로그 추가
  res.json({ exists: !!user });
});

// 아이디 찾기 엔드포인트
app.post("/api/find-id", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 비밀번호 찾기 엔드포인트
app.post("/api/reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1시간
    await user.save();

    const resetLink = `http://localhost:8081/reset-password/${token}`;

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "비밀번호 재설정",
      text: `다음 링크를 클릭하여 비밀번호를 재설정하세요:\n\n${resetLink}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Email error:", err); // 이메일 오류 로그 추가
        return res.status(500).json({ error: "Email could not be sent" });
      }
      res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (error) {
    console.error("Password reset error:", error); // 비밀번호 재설정 오류 로그 추가
    res.status(500).json({ error: error.message });
  }
});

// 비밀번호 재설정 엔드포인트
app.post("/api/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    user.setPassword(req.body.password, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(200).json({ message: "Password has been reset" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/auth/naver", passport.authenticate("naver"));

app.get(
  "/auth/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:8081/dashboard");
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:8081/dashboard");
  }
);

app.get("/auth/kakao", passport.authenticate("kakao"));

app.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:8081/dashboard");
  }
);

app.get("/api/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await User.findById(req.user.id);
  res.json({ message: `Welcome, ${user.displayName || user.username}!` });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
