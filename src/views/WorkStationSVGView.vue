<template>
    <div class="text-center wrap">
        <!-- <div class="block" @click="goToWorkStationSVGView()">
        </div> -->
        <img src="/images/WorkStationSVGView.png" alt="">
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchEffect } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import WaterBox from '@/components/WaterBox.vue'
import Enumerable from 'linq'
import { apiGetData } from '../apis/api'
import dayjs from 'dayjs'
import { WaterNeedsCalculator } from '@/utils/WaterNeedsCalculator'
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
// 取得路由
const router = useRouter();
function goToWorkStationSVGView(){
    router.push('/WorkStationSVGView?q=新屋站')
}
onMounted(async () => {
})
</script>

<style scoped lang="scss">
.pi {
    cursor: pointer;
}
.pi {
    cursor: pointer;
}

img {
    width: 100%;
    height: auto;
}

.wrap {
    position: relative;
    .block {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 67% 100%, 67% 45%, 0 45%);
        cursor: pointer;
        position: absolute;
        width: 43.7%;
        height: 61.3%;
        // border: 1px  solid #000;
        top: 8.3%;
        left: 43.5%;
        &:hover {
            border: 8px dashed #e87676;
            background-color:rgba(69, 189, 35, 0.2);
    }
    }
}
</style>