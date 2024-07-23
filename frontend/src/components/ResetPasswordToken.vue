<template>
  <div class="reset-password-container">
    <h2>비밀번호 재설정</h2>
    <form @submit.prevent="resetPassword">
      <div class="form-group">
        <input
          type="password"
          v-model="password"
          class="form-control"
          placeholder="새 비밀번호"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="passwordConfirm"
          class="form-control"
          placeholder="새 비밀번호 확인"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary btn-block">
        비밀번호 재설정
      </button>
    </form>
    <small v-if="message" class="text-success">{{ message }}</small>
    <small v-if="error" class="text-danger">{{ error }}</small>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResetPasswordToken",
  data() {
    return {
      password: "",
      passwordConfirm: "",
      message: "",
      error: "",
    };
  },
  methods: {
    async resetPassword() {
      if (this.password !== this.passwordConfirm) {
        this.error = "비밀번호가 일치하지 않습니다.";
        return;
      }
      try {
        const response = await axios.post(
          `/api/reset-password/${this.$route.params.token}`,
          { password: this.password }
        );
        this.message = response.data.message;
        this.error = "";
      } catch (error) {
        this.error = error.response
          ? error.response.data.error
          : "오류가 발생했습니다. 다시 시도해주세요.";
        this.message = "";
      }
    },
  },
};
</script>

<style scoped>
.reset-password-container {
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

.text-danger {
  color: red;
}

.text-success {
  color: green;
}
</style>
