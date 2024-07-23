const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  displayName: String,
  naverId: String,
  googleId: String,
  kakaoId: String,
  email: { type: String, unique: true, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

UserSchema.statics.findOrCreate = async function (condition, doc) {
  const user = await this.findOne(condition);
  return user || this.create(doc);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
