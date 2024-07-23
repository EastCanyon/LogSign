import { createRouter, createWebHistory } from "vue-router";
import MainHome from "@/components/MainHome.vue";
import Register from "@/components/Register.vue";
import Dashboard from "@/components/Dashboard.vue";
import FindID from "@/components/FindID.vue";
import FindPassword from "@/components/FindPassword.vue";
import ResetPasswordToken from "@/components/ResetPasswordToken.vue";
import UserLogin from "@/components/UserLogin.vue";

const routes = [
  { path: "/", component: MainHome },
  { path: "/login", component: UserLogin },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/find-id", component: FindID },
  { path: "/find-password", component: FindPassword },
  { path: "/reset-password/:token", component: ResetPasswordToken },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
