<template>
  <div class="register-container">
    <div v-if="step === 1">
      <h2>회원가입</h2>
      <button
        @click="selectRegisterType('email')"
        class="btn btn-primary btn-block"
      >
        이메일로 가입
      </button>
      <div class="social-register">
        <div>또는</div>
        <button @click="socialLogin('google')" class="btn btn-social">
          <img src="/images/google.png" alt="Google" />
        </button>
        <button @click="socialLogin('naver')" class="btn btn-social">
          <img src="/images/naver.png" alt="Naver" />
        </button>
        <button @click="socialLogin('kakao')" class="btn btn-social">
          <img src="/images/kakao.png" alt="Kakao" />
        </button>
      </div>
    </div>
    <div v-if="step === 2">
      <h2>약관 동의</h2>
      <div class="form-group">
        <input type="checkbox" v-model="terms.all" @change="toggleAllTerms" />
        <label>모두 동의</label>
      </div>
      <div
        class="form-group"
        v-for="(term, index) in terms.individual"
        :key="index"
      >
        <input type="checkbox" v-model="term.checked" />
        <label>{{ term.text }}</label>
      </div>
      <button
        @click="continueRegistration"
        class="btn btn-primary btn-block"
        :disabled="!requiredTermsAccepted"
      >
        동의 후 계속하기
      </button>
    </div>
    <div v-if="step === 3">
      <h2>회원가입</h2>
      <div class="form-group">
        <input
          type="text"
          v-model="nickname"
          class="form-control"
          placeholder="닉네임"
          @blur="checkNickname"
          required
        />
        <small v-if="nicknameError" class="text-danger">{{
          nicknameError
        }}</small>
      </div>
      <div class="form-group">
        <input
          type="email"
          v-model="email"
          class="form-control"
          placeholder="이메일"
          @blur="checkEmail"
          required
        />
        <small v-if="emailError" class="text-danger">{{ emailError }}</small>
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="password"
          class="form-control"
          placeholder="비밀번호"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="passwordConfirm"
          class="form-control"
          placeholder="비밀번호 확인"
          required
        />
        <small v-if="password !== passwordConfirm" class="text-danger"
          >비밀번호를 확인해주세요</small
        >
      </div>
      <button @click="register" class="btn btn-primary btn-block">
        회원가입
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserRegister",
  data() {
    return {
      step: 1,
      nickname: "",
      email: "",
      password: "",
      passwordConfirm: "",
      nicknameError: "",
      emailError: "",
      terms: {
        all: false,
        individual: [
          { text: "[LOGSIGN] 서비스이용약관", checked: false, required: true },
          {
            text: "[LOGSIGN] 개인정보 수집 및 이용동의",
            checked: false,
            required: true,
          },
          {
            text: "[LOGSIGN] 광고성 정보 수신 동의 (선택)",
            checked: false,
            required: false,
          },
        ],
      },
    };
  },
  computed: {
    requiredTermsAccepted() {
      return this.terms.individual.every(
        (term) => !term.required || term.checked
      );
    },
  },
  methods: {
    selectRegisterType(type) {
      if (type === "email") {
        this.step = 2;
      }
    },
    toggleAllTerms() {
      const allChecked = this.terms.all;
      this.terms.individual.forEach((term) => {
        if (term.required || allChecked) {
          term.checked = allChecked;
        }
      });
    },
    continueRegistration() {
      this.step = 3;
    },
    async checkNickname() {
      if (this.nickname) {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/check-nickname",
            {
              nickname: this.nickname,
            }
          );
          if (response.data.exists) {
            this.nicknameError = "중복된 닉네임입니다";
          } else {
            this.nicknameError = "";
          }
        } catch (error) {
          this.nicknameError = "오류가 발생했습니다. 다시 시도해주세요.";
        }
      }
    },
    async checkEmail() {
      if (this.email) {
        try {
          console.log("Checking email:", this.email); // 디버깅용 로그 추가
          const response = await axios.post(
            "http://localhost:3000/api/check-email",
            {
              email: this.email,
            }
          );
          console.log("Check email response:", response.data); // 디버깅용 로그 추가
          if (response.data.exists) {
            this.emailError = "이미 가입된 이메일입니다";
          } else {
            this.emailError = "";
          }
        } catch (error) {
          console.error("Check email error:", error); // 디버깅용 로그 추가
          this.emailError = "오류가 발생했습니다. 다시 시도해주세요.";
        }
      }
    },
    async register() {
      if (this.password !== this.passwordConfirm) {
        return;
      }

      if (!this.nicknameError && !this.emailError) {
        try {
          const response = await axios.post(
            "/api/register",
            {
              nickname: this.nickname,
              email: this.email,
              password: this.password,
            },
            { withCredentials: true }
          );
          alert(response.data.message);
          this.$router.push("/login");
        } catch (error) {
          if (error.response) {
            alert(error.response.data.error);
          } else if (error.request) {
            alert("No response received from the server.");
          } else {
            alert("An error occurred: " + error.message);
          }
        }
      }
    },
    socialLogin(provider) {
      window.location.href = `http://localhost:3000/auth/${provider}`;
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #007bff;
  outline: none;
}

.btn-block {
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #8258fa;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-block:hover {
  background-color: #6c47d8;
}

.social-register {
  text-align: center;
}

.social-register div {
  margin-bottom: 0.5rem;
}

.btn-social {
  margin: 0 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
}

.btn-social img {
  width: 32px;
  height: 32px;
}

.text-danger {
  color: red;
}
</style>
