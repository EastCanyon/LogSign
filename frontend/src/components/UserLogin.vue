<template>
  <div class="login-container">
    <img src="/images/Log Sign.png" alt="Log Sign" class="logo" />
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <input
          type="text"
          v-model="username"
          class="form-control"
          placeholder="이메일"
          required
        />
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
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="rememberMe" />
        <label class="form-check-label" for="rememberMe">로그인 유지</label>
      </div>
      <button type="submit" class="btn btn-primary btn-block">로그인</button>
    </form>
    <div class="social-login">
      <div>소셜 로그인</div>
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
    <hr class="divider" />
    <div class="additional-links">
      <router-link to="/find-id" class="link">아이디 찾기</router-link>
      <router-link to="/find-password" class="link">비밀번호 찾기</router-link>
      <router-link to="/register" class="link">회원가입</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserLogin",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "/api/login",
          {
            username: this.username,
            password: this.password,
          },
          { withCredentials: true }
        );
        alert(response.data.message);
        this.$router.push("/dashboard");
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        } else if (error.request) {
          alert("No response received from the server.");
        } else {
          alert("An error occurred: " + error.message);
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
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

.logo {
  width: 150px;
  margin-bottom: 1rem;
}

.login-form {
  margin-bottom: 1rem;
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

.social-login {
  margin-top: 1rem;
  text-align: center;
}

.social-login div {
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

.divider {
  margin: 1rem 0;
}

.additional-links {
  display: flex;
  justify-content: space-between;
}

.additional-links .link {
  color: #007bff;
  text-decoration: none;
}

.additional-links .link:hover {
  text-decoration: underline;
}
</style>
