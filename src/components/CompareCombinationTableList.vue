<template>
    <div class="table_wrap table-container">
        <table class="table table-border table-hover" style="font-size: large;">
            <thead>
                <tr>
                    <td class="text-center">選取</td>
                    <td class="text-center">方案排名</td>
                    <td class="text-center">灌區組合</td>
                    <!--<td>整田期錯開</td>-->
                    <td class="text-end">供灌面積(公頃)</td>
                    <td class="text-end">供灌需水量(萬噸)</td>
                    <td class="text-end">詳細資訊</td>
                </tr>
                <!--<td>raw data</td>-->
            </thead>
            <tbody>
                <!--@click="combinationPicked(combo)" -->
                <tr v-for="(combo, comboIdx) in store.allCombinationListData" :key="comboIdx">
                    <td class="bg-opacity-50 text-center" :class="getRowStyleByRank(combo.rank)">
                        <input type="radio" :value="combo" id="irrigationCombination"
                            v-model="store.solutionUserPicked.irrigationCombination">
                    </td>
                    <td class="bg-opacity-50 text-center" :class="getRowStyleByRank(combo.rank)">{{ (combo.rank > 0) ?
                        combo.rank :
                        (combo.rank + 1) }}</td>
                    <td class="bg-opacity-50 text-center" :class="getRowStyleByRank(combo.rank)">
                        {{ combo.title }}
                    </td>
                    <!--<td class="bg-opacity-50" :class="getRowStyleByRank(combo.rank)">
                        <a href="#" @click.prevent="goToSchedule(combo.title)"><i class="fa-solid fa-calendar-days"></i></a>
                      </td>-->

                    <td class="bg-opacity-50 text-end" :class="getRowStyleByRank(combo.rank)">
                        {{ combo.totalArea.toLocaleString() }}</td>
                    <td class="bg-opacity-50 text-end" :class="getRowStyleByRank(combo.rank)">
                        {{ combo.totalWaterNeeds.toLocaleString() }}</td>
                    <td class="bg-opacity-50 text-end" :class="getRowStyleByRank(combo.rank)">
                        <i class="pi pi-external-link" @click="goToSchedule(combo.title)"></i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
import { RouterLink, RouterView, useRouter } from 'vue-router'
// 取得路由
const router = useRouter();
//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);

// const props = defineProps({
//     allCombinationListData: Array,
//     default: () => []
// })
// const allCombinationListData= ref([
//     {"title":"桃一、桃二、桃三、石一、石二","totalArea":17897,"totalWaterNeeds":25965,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":-2},{"title":"桃一、桃二、桃三、石一","totalArea":15163,"totalWaterNeeds":21917,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":-1},{"title":"桃一、桃二、桃三、石二","totalArea":14406,"totalWaterNeeds":21133,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":1},{"title":"桃二、桃三、石一、石二","totalArea":13460,"totalWaterNeeds":19876,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":2},{"title":"桃一、桃二、石一、石二","totalArea":13222,"totalWaterNeeds":18726,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":3},{"title":"桃一、桃二、桃三","totalArea":11673,"totalWaterNeeds":17086,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":4},{"title":"桃三、石一、石二","totalArea":10899,"totalWaterNeeds":16117,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":5},{"title":"桃二、桃三、石一","totalArea":10726,"totalWaterNeeds":15829,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}}],"rank":6},{"title":"桃二、桃三、石二","totalArea":9969,"totalWaterNeeds":15045,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":7},{"title":"桃一、桃二、石一","totalArea":10489,"totalWaterNeeds":14678,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":8},{"title":"桃一、桃二、石二","totalArea":9732,"totalWaterNeeds":13895,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":9},{"title":"桃二、石一、石二","totalArea":8785,"totalWaterNeeds":12638,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":10},{"title":"桃三、石一","totalArea":8165,"totalWaterNeeds":12070,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}}],"rank":11},{"title":"桃三、石二","totalArea":7408,"totalWaterNeeds":11286,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":12},{"title":"桃二、桃三","totalArea":7236,"totalWaterNeeds":10997,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}}],"rank":13},{"title":"桃一、桃二","totalArea":6998,"totalWaterNeeds":9847,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃一","供灌面積":4436.97910166,"供灌需水量":6088.357838078209}}}],"rank":14},{"title":"石一、石二","totalArea":6224,"totalWaterNeeds":8879,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":15},{"title":"桃二、石一","totalArea":6052,"totalWaterNeeds":8590,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}}],"rank":16},{"title":"桃二、石二","totalArea":5295,"totalWaterNeeds":7806,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}},{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":17},{"title":"桃三","totalArea":4675,"totalWaterNeeds":7239,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃三","供灌面積":4674.512259000002,"供灌需水量":7238.642027589258}}}],"rank":18},{"title":"石一","totalArea":3490,"totalWaterNeeds":4831,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石一","供灌面積":3490.3726082899993,"供灌需水量":4831.242069860256}}}],"rank":19},{"title":"石二","totalArea":2734,"totalWaterNeeds":4048,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"石二","供灌面積":2733.71350642,"供灌需水量":4047.505328910359}}}],"rank":20},{"title":"桃二","totalArea":2561,"totalWaterNeeds":3759,"groupList":[{"_custom":{"type":"reactive","stateTypeName":"Reactive","value":{"灌區":"桃二","供灌面積":2561.20252467,"供灌需水量":3758.8298165665337}}}],"rank":21}
// ])
function combinationPicked(combo) {

    combo.isSelected = true
    store.value.combinationPicked = combo
}
// watch(() => store.value.allCombinationListData, (newVal) => {
//     // store.value.solutionUserPicked.irrigationCombination = null

// })
//供灌方案有變 就跳轉到step3
// watch(() => store.value.solutionUserPicked.irrigationCombination, (n,o) => {
//     if(n !== o && n !== null){
//         // router.push('/step3')
//         console.log(`!!! n:${n},o:${o}`)
//     }

// }, {
//   immediate: false
// })
// 方案 tr 背景著色
function getRowStyleByRank(rank) {
    return {
        'bg-danger': rank == -1,
        'bg-body-secondary': rank < -1,
        'bg-success': rank >= 1 && rank <= 1,
    };
}
function goToSchedule(title) {
    // if (process.env.NODE_ENV === 'production') {
        
    //     // window.open(`/projects/taoyuanIrrigation-v7/IrrigationDistrictListSVGView?q=${title}`, '_blank')
    //     window.open(`${import.meta.env.BASE_URL}IrrigationDistrictListSVGView?q=${title}`, '_blank')

    // } else {
        
    // }
    window.open(`/#/IrrigationDistrictListSVGView?q=${title}`)

    
    // const routeData = router.resolve({ path: "/IrrigationDistrictListSVGView", query: { q: title } });
    // const url = window.location.origin + routeData.fullPath;

    // console.log("@@url:", url); // 確保輸出完整網址
    // window.open(url, "_blank");
//     const c = router.resolve({
//     path: `/IrrigationDistrictListSVGView?q=${title}`,
//   });
//   window.open(c.href, "_blank");
}
</script>

<style scoped lang="scss">
.table-container {
    max-height: 610px;
    /* 限制最大高度，讓內容滾動 */
    overflow-y: auto;
    /* 垂直滾動 */
    border: 1px solid #ddd;
    /* 加上邊框以區分表格 */
}

.table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    position: sticky;
    top: 0;
    background: white;
    /* 確保固定時表頭有背景色 */
    z-index: 10;
    /* 讓表頭層級較高，避免被內容蓋住 */
}

th,
td {
    padding: 8px;
    // border: 1px solid #ddd;
    white-space: nowrap;
    /* 避免換行 */
}

tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
    /* 滑鼠移上時的背景變化 */
}

.pi {
    cursor: pointer;
}
</style>