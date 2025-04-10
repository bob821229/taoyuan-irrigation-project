<template>

    <div class="text-center wrap" @mousemove="updateTooltip">

        <!-- <div v-if="tooltip.visible">
            {{ tooltip.content }}
        </div> -->
        <div class="block" @click="goToWorkStationSVGView()">
        </div>
        <div class="block1" @mouseenter="setTooltip(obj1)" @mouseleave="hideTooltip">
        </div>
        <div class="block2" @mouseenter="setTooltip(obj2)" @mouseleave="hideTooltip">
        </div>
        <img src="/images/IrrigationDistrictSVGView.png" alt="">
        <div v-if="tooltip.visible" class="infoTooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
            名稱: {{ tooltip.label }}
            <div class="d-flex">
                <WaterBox style="max-width: 250px;" v-for="p in tooltip.pondList" :key="p"  :title="p.ChannelName" :value="p.PercentageOfPondStorage" :waterCount="p.PondStorage"></WaterBox>
            </div>
        </div>
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
const obj1 = ref({ label: '8支線14分線', content: '123' ,pondList:[
    {
        IANo: null,
        WorkStationId: "04002",
        IAName: "石門",
        WorkStationName: "中壢",
        ChannelName: "平鎮",
        fileTime: "03/03",
        PondCount: 2,
        PondCapacity: 1.51,
        PondStorage: 0.94,
        PercentageOfPondStorage: 62.12,
        previousFileTime: "02/17",
        previousPondStorage: 0.96,
        ChineseFileTime: "114/2/24"
    }]})
const obj2 = ref({ label: '8支線11、12分線', content: '123' ,pondList:[
    {
        "IANo": null,
        "WorkStationId": "04001",
        "IAName": "石門",
        "WorkStationName": "八德",
        "ChannelName": "員樹林",
        "fileTime": "03/03",
        "PondCount": 69,
        "PondCapacity": 138.77,
        "PondStorage": 80.95,
        "PercentageOfPondStorage": 58.34,
        "previousFileTime": "02/17",
        "previousPondStorage": 82.86,
        "ChineseFileTime": "114/2/24"
    },
    {
        "IANo": null,
        "WorkStationId": "04002",
        "IAName": "石門",
        "WorkStationName": "中壢",
        "ChannelName": "中壢",
        "fileTime": "03/03",
        "PondCount": 22,
        "PondCapacity": 9.1,
        "PondStorage": 4.52,
        "PercentageOfPondStorage": 30.67,
        "previousFileTime": "02/17",
        "previousPondStorage": 4.66,
        "ChineseFileTime": "114/2/24"
    }]})
const tooltip = ref({ visible: false, x: 0, y: 0, content: '', label: '' ,pondList:[]});
const updateTooltip = (event) => {
    if (tooltip.value.visible) {
        tooltip.value.x = event.pageX; // 讓 tooltip 顯示在鼠標右側
        tooltip.value.y = event.pageY - 62;
    }
};

const setTooltip = (item) => {
    tooltip.value.content = item.content;
    tooltip.value.label = item.label;
    tooltip.value.pondList = item.pondList;
    tooltip.value.visible = true;
};

const hideTooltip = () => {
    tooltip.value.visible = false;
};
// 取得路由
const router = useRouter();
function goToWorkStationSVGView() {
    router.push('/WorkStationSVGView?q=新屋站')
}
onMounted(() => {
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
        // clip-path: polygon(0 0, 100% 0, 100% 100%, 67% 100%, 67% 45%, 0 45%);
        cursor: pointer;
        position: absolute;
        width: 16%;
        height: 33%;
        top: 36.8%;
        left: 55.2%;

        &:hover {
            border: 8px dashed #e87676;
            background-color: rgba(69, 189, 35, 0.2);
        }
    }

    .block1 {
        cursor: pointer;
        position: absolute;
        width: 7%;
        height: 4%;
        top: 19.3%;
        left: 26.2%;

        &:hover {
            border: 5px dashed #e87676;
            background-color: rgba(69, 189, 35, 0.2);
        }
    }

    .block2 {
        cursor: pointer;
        position: absolute;
        width: 8.4%;
        height: 4%;
        // border: 6px solid #000;
        top: 25.3%;
        left: 24.8%;

        &:hover {
            border: 5px dashed #e87676;
            background-color: rgba(69, 189, 35, 0.2);
        }
    }
}

.infoTooltip {
    // max-width: 500px;
    font-size: 20px;
    font-weight: bold;
    z-index: 1000;
    position: absolute;
    background: #02ADBF;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: #1b1b1b 10px 10px 20px;
}
</style>