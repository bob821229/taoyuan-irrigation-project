import { createRouter, createWebHistory,createWebHashHistory } from "vue-router";
import { useComprehensiveDataStore } from "@/stores/comprehensiveDataStore";
const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(import.meta.env.BASE_URL), // 改成 Hash 模式
    routes: [
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
        {
            path: "/IrrigationDistrictListSVGView",
            name: "IrrigationDistrictListSVGView",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/IrrigationDistrictListSVGView.vue"),
        },
        {
            path: "/IrrigationDistrictSVGView",
            name: "IrrigationDistrictSVGView",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/IrrigationDistrictSVGView.vue"),
        },
        {
            path: "/WorkStationSVGView",
            name: "WorkStationSVGView",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/WorkStationSVGView.vue"),
        },
        // { path: '/projects/taoyuanIrrigation-v7/', redirect: '/' }, // 捕捉所有未知路徑並導向首頁
        // { path: '/:pathMatch(.*)*', redirect: '/' }, // 捕捉所有未知路徑並導向首頁
    ],
});
router.beforeEach((to, from, next) => {
    next(); // 正常進入目標路由
    // const comprehensiveDataStore = useComprehensiveDataStore();

    // 確保 `simulationData` 已初始化
    // if (!comprehensiveDataStore.simulationData || comprehensiveDataStore.simulationData.outcomes == null) {
    //     if (to.name !== 'step1') {
    //         next({ name: 'step1' }); // 只在非 `step1` 路由時跳轉
    //     } else {
    //         next(); // 如果已在 `step1`，允許進入
    //     }
    // } else {
    //     next(); // 正常進入目標路由
    // }
});
export default router;
