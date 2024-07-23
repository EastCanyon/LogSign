<template>
  <div class="find-id-container">
    <h2>아이디 찾기</h2>
    <div class="form-group">
      <input
        type="email"
        v-model="email"
        class="form-control"
        placeholder="가입한 이메일 주소"
        required
      />
    </div>
    <button @click="findId" class="btn btn-primary btn-block">
      아이디 찾기
    </button>
    <div v-if="message" class="text-success">{{ message }}</div>
    <div v-if="error" class="text-danger">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FindId",
  data() {
    return {
      email: "",
      message: "",
      error: "",
    };
  },
  methods: {
    async findId() {
      try {
        const response = await axios.post("/api/find-id", {
          email: this.email,
        });
        this.message = `아이디는 ${response.data.username} 입니다.`;
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
.find-id-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
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

.text-success {
  color: green;
}

.text-danger {
  color: red;
}
</style>
