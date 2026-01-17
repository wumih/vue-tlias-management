import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login/index.vue"),
    },
    {
      path: "/",
      component: () => import("../views/layout/index.vue"),
      redirect: "/index",
      children: [
        {
          path: "/index",
          name: "index",
          component: () => import("../views/index/index.vue"),
        },
        {
          path: "/clazz",
          name: "clazz",
          component: () => import("../views/clazz/index.vue"),
        },
        {
          path: "/stu",
          name: "stu",
          component: () => import("../views/stu/index.vue"),
        },
        {
          path: "/dept",
          name: "dept",
          component: () => import("../views/dept/index.vue"),
        },
        {
          path: "/emp",
          name: "emp",
          component: () => import("../views/emp/index.vue"),
        },
        {
          path: "/report/emp",
          name: "empReport",
          component: () => import("../views/report/emp/index.vue"),
        },
        {
          path: "/report/stu",
          name: "stuReport",
          component: () => import("../views/report/stu/index.vue"),
        },
        {
          path: "/log",
          name: "log",
          component: () => import("../views/log/index.vue"),
        },
      ],
    },
  ],
});

export default router;
