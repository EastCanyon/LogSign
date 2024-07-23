<template>
  <div class="home-container">
    <img src="/images/Log Sign.png" alt="Log Sign" class="logo" />
    <div class="nav-buttons">
      <router-link to="/login" class="btn">로그인</router-link>
      <router-link to="/register" class="btn">회원가입</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainHome",
};
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo {
  width: 150px;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-decoration: none;
  color: #000;
  background-color: #f8f8f8;
}

.btn:hover {
  background-color: #e0e0e0;
}
</style>
