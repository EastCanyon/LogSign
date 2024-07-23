<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  name: "UserDashboard",
  data() {
    return {
      message: "",
    };
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard data:", data); // 대시보드 데이터 로그 출력
          this.message = data.message;
        } else {
          this.message = "You are not authorized to access this page.";
        }
      } catch (error) {
        console.error("Fetch error:", error); // 오류 로그 출력
        this.message = "An error occurred. Please try again later.";
      }
    },
  },
};
</script>
