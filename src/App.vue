<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import { ref, watchEffect, onMounted, computed } from 'vue'
import { useComprehensiveDataStore } from './stores/comprehensiveDataStore';

import { ApiCaller } from "@/utils/ApiCallerModule";
import { AxiosDatabaseTables } from '@/utils/AxiosDatabaseTables.js';
import axios from 'axios';
import gsap from "gsap";
import 'animate.css'; /* 確保 animate.css 有正確載入 */

const enter = (el, done) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 20, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.45, // 讓新組件稍微晚一點進場
      onComplete: done
    }
  );
};

const leave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    y: -20,
    scale: 0.50,
    duration: 0.5,
    ease: "power2.in",
    onComplete: done
  });
};


//取得store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);

const axiosDatabaseTables = ref(null);
const apiCaller = ref(null);
// 取得資料
async function getDatabaseTables() {
  apiCaller.value = new ApiCaller({
    axios: axios,
    finallyCallback: function () {
      console.log("finally");
    },
  });
  axiosDatabaseTables.value = new AxiosDatabaseTables();
  comprehensiveDataStore.databaseTables = await axiosDatabaseTables.value.getOutcome();
  console.log("databaseTables:", comprehensiveDataStore.databaseTables);
}
onMounted(() => {
  getDatabaseTables()
})
</script>

<template>

  <Header></Header>

  <div class="wrap">
    <router-view v-slot="{ Component }">
      <transition @enter="enter" @leave="leave" mode="default" :duration="{ enter: 600, leave: 400 }">
  <component :is="Component" :key="$route.path" />
</transition>
    </router-view>
  </div>
</template>

<style scoped>
.wrap {
  padding: 20px 25px;
  /* border: 1.5px solid rgba(0, 0, 0, 0.175); */
  /* border-radius: 5px; */
  /* margin: 10px 0; */
  background-color: #b4c6b4;
  min-height: calc(100vh - 62px);
}
</style>
