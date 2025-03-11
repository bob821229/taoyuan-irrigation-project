import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //   path: '/',
        //   name: 'home',
        //   component: HomeView,
        // },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/",
            name: "step1",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step1View.vue"),
        },
        {
          path: "/step1_2",
          name: "step1_2",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("../views/Step1_2View.vue"),
      },
        {
            path: "/step2",
            name: "step2",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step2View.vue"),
        },
        {
            path: "/step3",
            name: "step3",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step3View.vue"),
        },
        {
            path: "/step4",
            name: "step4",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step4View.vue"),
        },
        {
            path: "/step4_2",
            name: "step4_2",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step4_2View.vue"),
        },
        {
            path: "/step5",
            name: "step5",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step5View.vue"),
        },
        {
            path: "/step6",
            name: "step6",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step6View.vue"),
        },
        {
            path: "/step7",
            name: "step7",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Step7View.vue"),
        },
        { path: '/:pathMatch(.*)*', redirect: '/' }, // 捕捉所有未知路徑並導向首頁
    ],
});

export default router;
