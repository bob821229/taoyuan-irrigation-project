<template>
    <div class="row">
        <div class="col-12 top_wrap">
            <div class="card_groups mb-2">
                <div class="row ">
                    <div class="col-md-4 col-sm-12 ">
                        <CounterCard class="item h-100" :titleTxt="`可供灌總面積(公頃)`"
                            :number="store.minPlantingAreaAvailableToIrrigatedByReservoirWaterData"></CounterCard>
                    </div>
                    <div class="col-md-4 col-sm-12 " @click="showEcharts = !showEcharts" v-tooltip.bottom="tooltipTxt"
                        type="text" placeholder="Bottom">
                        <CounterCard class="item h-100" :titleTxt="`可供灌總配水量(萬噸)`"
                            :number="store.availableWaterForAgricultureData">
                            <template #icon>
                                <i v-if="!showEcharts" style="width: 10px;height: 10px;" class="pi pi-chevron-down"></i>
                                <i v-if="showEcharts" style="width: 10px;height: 10px;" class="pi pi-chevron-up"></i>
                            </template>
                        </CounterCard>
                    </div>
                    <div class="col-md-4 col-sm-12 ">
                        <CounterCard class="item h-100" :titleTxt="`種植密度`" :number="store.baseDataPathTxt">
                        </CounterCard>
                    </div>
                </div>
            </div>
            <!-- 圖表 -->

            <!-- mapKey: {{ mapKey }} -->
            <transition name="slide-fade">
                <div class="echart_wrap" v-if="showEcharts">
                    <div class="col-md-12  d-flex justify-content-center">
                        <div class=" triangle"></div>
                    </div>
                    <Card class="">
                        <template #header></template>
                        <template #subtitle></template>
                        <template #content>
                            <div class="row">
                                <div class="col-6">
                                    <SimpleEchart :chart-width="'100%'" :chart-height="'53vh'"
                                        :chart-x-axis="store.plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData.chartXAxis"
                                        :chart-y-axis="store.plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData.chartYAxis"
                                        :chart-series="store.plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData.chartSeries" />
                                </div>
                                <div class="col-6">
                                    <SimpleEchart :chart-width="'100%'" :chart-height="'53vh'"
                                        :chart-x-axis="store.reservoirWaterUnitAssignmentsByTendaysChartData.chartXAxis"
                                        :chart-y-axis="store.reservoirWaterUnitAssignmentsByTendaysChartData.chartYAxis"
                                        :chart-series="store.reservoirWaterUnitAssignmentsByTendaysChartData.chartSeries" />
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </transition>
        </div>
        <!-- 左邊 方案表格 -->
        <div class="col-md-6">
            <Card class="h-100">
                <template #title>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            水源
                        </span>
                        <Button icon="pi  pi-table" class="echarts_trigger"
                            v-tooltip.bottom="{ value: '顯示各工作站總配水量表', showDelay: 300, hideDelay: 300 }" type="text"
                            placeholder="Bottom" @click="showTable = !showTable" />
                    </div>
                </template>
                <template #content>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">加強灌溉措施折扣(乾旱時適用)：</span>
                                <input type="number" min="0" max="100" class="form-control"
                                    v-model="comprehensiveDataStore.userSettings.step2.fieldWaterNeedPercentage"
                                    @keyup.enter="changePlantingArea">
                                <span class="input-group-text" id="basic-addon1">%</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">種植密度：</span>
                                <select class="form-select"
                                    v-model="comprehensiveDataStore.userSettings.step2.baseDataPath"
                                    @change="changePlantingArea">
                                    <option
                                        v-for="(obj, idx) in comprehensiveDataStore.uiSettings.baseDataPlantingAreaPathList"
                                        :value="obj" :key="idx">
                                        {{ obj.text }}</option>
                                </select>
                            </div>
                        </div>
                        <!-- solutionUserPicked:{{store.solutionUserPicked}} -->
                        <div class="col-md-12">
                            <CompareCombinationTableList></CompareCombinationTableList>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <!-- 右邊 顯示區域 -->
        <div class="col-md-6">
            <!-- 灌區及種植坵塊地圖 -->
            <Card v-if="showMaps && !showTable" class='h-100 ' :key="mapKey">
                <template #header></template>
                <template #title>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            灌區及種植坵塊地圖
                        </span>
                        <Button icon="pi  pi-chart-line" class="echarts_trigger"
                            v-tooltip.bottom="{ value: '顯示模擬驗證圖', showDelay: 300, hideDelay: 300 }" type="text"
                            placeholder="Bottom" @click="showMaps = false" />
                    </div>
                </template>
                <template #content>
                    <div class="row">
                        <div class="col-12 d-flex gap-3"
                            style="text-align: right;align-self: center;justify-content: flex-end;font-weight: bold;">
                            <div class="d-flex gap-1 align-items-center">
                                工作站 :
                                <ToggleSwitch v-model="mapConfigs.showWaterGroup" />
                            </div>
                            <div class="d-flex gap-1 align-items-center">
                                種植坵塊:
                                <ToggleSwitch v-model="mapConfigs.showPlantingMound" />
                            </div>


                        </div>
                        <div class="col-md-6" v-show="false">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">工作站：</span>
                                <select class="form-select">
                                    <option v-for="(obj, idx) in workstationOptions" :value="obj" :key="idx">
                                        {{ obj[`工作站名稱`] }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6" v-show="false">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">支線：</span>
                                <select disabled class="form-select">
                                    <option
                                        v-for="(obj, idx) in comprehensiveDataStore.uiSettings.baseDataPlantingAreaPathList"
                                        :value="obj" :key="idx">
                                        {{ obj.text }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <Maps :mapConfigs="mapConfigs"></Maps>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="row">
                        <div class="col-6">
                            <CounterCard class="item h-100" :txtClass="waterShortageTxtColor" :titleTxt="`尚缺水量(萬噸)`"
                                :number="waterShortage">
                                <template #footer-txt>
                                    <div class="text-start" style="color: #94A3B8;">
                                        計算公式 : 尚缺水量 = 可供灌總配水量 - 供灌需水量 
                                    </div>
                                </template>
                            </CounterCard>
                        </div>
                        <div class="col-6">
                            <CounterCard class="item h-100" :titleTxt="`埤塘總水量(萬噸)`" :number="totalPondStorage">
                            </CounterCard>
                        </div>
                    </div>
                </template>
            </Card>
            <!-- 供灌模擬驗證圖 -->
            <Card v-if="!showMaps && !showTable" class='h-100 ' :key="irragationTrendChartDataForThisPage">
                <template #header></template>
                <template #title>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            供灌模擬驗證圖
                        </span>
                        <Button icon="pi  pi-map" class="echarts_trigger"
                            v-tooltip.bottom="{ value: '顯示種植坵塊地圖', showDelay: 300, hideDelay: 300 }" type="text"
                            placeholder="Bottom" @click="showMaps = true" />
                    </div>
                </template>
                <template #content>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">水庫蓄水線-民國</span>
                        <select v-model="pickedYear" class="form-select">
                            <option :value="null" disabled>請選擇年份</option>
                            <option v-for="(obj, idx) in reservoirWaterStoarageYearListData" :key="idx"
                                :value="obj.adYear">{{ obj.rocYear }}</option>
                        </select>
                        <span class="input-group-text" id="basic-addon1">年</span>
                    </div>
                    <SimpleEchart :titleTxt="null" :chart-x-axis="irragationTrendChartDataForThisPage.chartXAxis"
                        :chart-y-axis="irragationTrendChartDataForThisPage.chartYAxis"
                        :chart-series="irragationTrendChartDataForThisPage.chartSeries">
                    </SimpleEchart>
                </template>
            </Card>
            <!-- 各工作站總配水量表 -->
            <Card v-if="showTable" class='h-100 ' :key="irragationTrendChartDataForThisPage">
                <template #header></template>
                <template #title>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            各工作站總配水量表
                        </span>
                    </div>
                </template>
                <template #content>
                    <WorkstationWaterNeedsTable :table-list="summaryByWorkstationData">
                    </WorkstationWaterNeedsTable>
                </template>
            </Card>
        </div>

        <!-- 按鈕 -->
        <div class="col-12 btn_wrap">
            <Button @click="previousStep">上一步</Button>
            <Button @click="nextStep">整田期錯開</Button>
        </div>
    </div>


</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
import { WaterNeedsCalculator } from '@/utils/WaterNeedsCalculator'
import { WaterProvidingCalculator } from '@/utils/WaterProvidingCalculator'
import CompareCombinationTableList from '../components/CompareCombinationTableList.vue';
import WorkstationWaterNeedsTable from '../components/WorkstationWaterNeedsTable.vue'
import CounterCard from '../components/CounterCard.vue';
import SimpleEchart from '../components/SimpleEchart.vue';
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Enumerable from "linq";
import Maps from '../components/Maps.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js'


const mapConfigs = ref({
    showWaterGroup: false,//顯示水利小組
    showPlantingMound: true,//顯示種植坵塊
})
const mapKey = computed(() => {
    let land_using_frequency = JSON.stringify(store.value.baseDataPlantingAreaPathPickedData)
    let solutionUserPicked = JSON.stringify(store.value.solutionUserPicked.irrigationCombination)
    let mapConfig = JSON.stringify(mapConfigs.value)

    return land_using_frequency + solutionUserPicked + mapConfig
})

const waterShortage = computed(() => {
    let availableWaterForAgricultureData = 0
    let totalWaterNeeds = 0

    if (store.value.availableWaterForAgricultureData != null) {
        availableWaterForAgricultureData = store.value.availableWaterForAgricultureData

    }
    if (store.value.solutionUserPicked.irrigationCombination != null) {
        totalWaterNeeds = store.value.solutionUserPicked.irrigationCombination.totalWaterNeeds

    } else {
        if (store.value.allCombinationListData.length > 0) {
            totalWaterNeeds = store.value.allCombinationListData[0].totalWaterNeeds
        }
    }

    return (availableWaterForAgricultureData - totalWaterNeeds)
})
const waterShortageTxtColor = computed(() => {
    if (waterShortage.value < 0) {
        return 'text-danger'
    } else {
        return 'text-success'
    }
})
// 總埤塘水量
const totalPondStorage = computed(() => {
    // 選取的灌區
    let selectedAreas = ["桃一", "桃二", "桃三", "石一", "石二"]
    if (store.value.solutionUserPicked.irrigationCombination != null) {
        selectedAreas = store.value.solutionUserPicked.irrigationCombination.groupList.map(f => f['灌區'])
    }
    // 篩選出特定灌區的資料
    let modifiedArray = Enumerable.from(store.value.databaseTables['埤塘蓄水比率'])
        .where(f => selectedAreas.includes(f.灌區))
        .select(f => ({
            ...f,
            [`埤塘目前庫容(m3)`]: f[`埤塘目前庫容(m3)`] || 0,
            [`埤塘總庫容(m3)`]: f[`埤塘總庫容(m3)`] || 0
        })).toArray()
    const result = Enumerable.from(modifiedArray)
        .select(f => ({
            ...f,
            totalStorage: f["埤塘總庫容(m3)"] / 10000 * f["埤塘目前庫容比率"]
        }))
        .sum(f => f.totalStorage)



    return result
})
const showTable = ref(false);
const showEcharts = ref(false);
const showMaps = ref(true);
const tooltipTxt = computed(() => {
    if (!showEcharts.value) {
        return { value: '顯示圖表資訊', showDelay: 300, hideDelay: 300 }
    } else {
        return { value: '隱藏圖表資料', showDelay: 300, hideDelay: 300 }

    }
})
//取得store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
// const currentData = ref(employeeStore.tmpBasicInformation);
const store = computed(() => comprehensiveDataStore);
const summaryByWorkstationData = computed(() => {
    let list = Enumerable.from(store.value.compareSimulationData.outcomes.summaryByWorkstation).where(f => solutionIrrigationGroupList.value.includes(f['灌區'])).toArray();
    return list;
})
const solutionIrrigationGroupList = computed(() => {
    if (store.value.solutionUserPicked.irrigationCombination != null) {

        let irrigationGroupList = Enumerable.from(store.value.solutionUserPicked.irrigationCombination.groupList).select(f => f['灌區']).toArray();
        return irrigationGroupList;
    } else {
        return ["桃二", "桃三", "石一", "石二", "桃一"];
    }
})
const workstationOptions = computed(() => {
    // solutionIrrigationGroupList.value
    let arr = Enumerable.from(store.value.databaseTables['灌區']).where(f => solutionIrrigationGroupList.value.includes(f['灌區'])).toArray();
    return arr;
})
// 取得路由
const router = useRouter();

//計算公式js
const waterNeedsCalculator = ref(null);
//計算公式js
const waterProvidingCalculator = ref(null);
// 初始化
async function init() {


    await loadData(basicBaseDataFilterCallback);

    waterProvidingCalculator.value = new WaterProvidingCalculator();
    await waterProvidingCalculator.value.loadData();
}
// 比較用途的 設定
const compareSettings = ref(null)
const prefix = ref(null)
async function loadData(baseDataFilterCallback) {
    console.log('loadData');
    waterNeedsCalculator.value = new WaterNeedsCalculator();

    compareSettings.value = copyJsonObject(store.value.userSettings.step1);
    compareSettings.value.baseDataPath = store.value.userSettings.step2.baseDataPath
    compareSettings.value.fieldWaterNeedPercentage = store.value.userSettings.step2.fieldWaterNeedPercentage;

    compareSettings.value.baseDataFilterCallback = baseDataFilterCallback;

    await waterNeedsCalculator.value.calculate(
        compareSettings.value
    );

    comprehensiveDataStore.compareSimulationData.baseData = await waterNeedsCalculator.value.getBaseData();     //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
    comprehensiveDataStore.compareSimulationData.outcomes = await waterNeedsCalculator.value.getOutcomes();
    comprehensiveDataStore.compareSimulationData.reservoirWaterStoarage = await waterNeedsCalculator.value.getReservoirWaterStoarage();
    comprehensiveDataStore.compareSimulationData.areaWaterNeedsByIrrigationGroup = await waterNeedsCalculator.value.getAreaWaterNeedsByIrrigationGroup();
    prefix.value = waterNeedsCalculator.value.prefix;

}
function basicBaseDataFilterCallback(_baseData) {
    let _filterData = Enumerable.from(_baseData).where(
        f => f['灌區'] != '桃沒分區')
        .toArray();
    return _filterData;
}
// 折扣或種植密度改變
async function changePlantingArea() {
    console.log('changePlantingArea', comprehensiveDataStore.userSettings.step2.baseDataPath);
    await loadData(basicBaseDataFilterCallback);
    store.value.solutionUserPicked.irrigationCombination = null

}



//深拷貝
function copyJsonObject(obj) {
    return JSON.parse(JSON.stringify(obj));
};
onMounted(() => {
    init()
})



const pickedYear = ref(null);
const reservoirWaterStoarageYearListData = computed(() => {
    let list = Enumerable.from(store.value.databaseTables['石門水庫歷史蓄水量-特定年']).groupBy(f => f.DataYear).select(g => {
        let obj = {
            adYear: g.key(),
            rocYear: g.key() - 1911
        }
        return obj;
    }).orderByDescending(f => f.adYear).toArray();
    return list;
})
//加上特定年的選項
const irragationTrendChartDataForThisPage = computed(() => {
    let optionData = copyJsonObject(store.value.irragationTrendChartData);
    if (pickedYear.value != null) {
        let minTendaysNumber = 4
        let maxTendaysNumber = optionData.chartXAxis.data.length + minTendaysNumber - 1;

        console.log(optionData.chartXAxis.data, minTendaysNumber, maxTendaysNumber);

        let _list = Enumerable.from(store.value.databaseTables['石門水庫歷史蓄水量-特定年'])
            .where(f =>
                f.TenDayNo >= minTendaysNumber && f.TenDayNo <= maxTendaysNumber &&
                f.DataYear == pickedYear.value).select(f => f.EffectiveStorage).toArray();



        let data = {
            name: `石門水庫民國${(pickedYear.value - 1911)}年蓄水線`,
            type: 'line',
            data: _list,
            lineStyle: {
                color: '#000000',
                // width: 5
            },
            itemStyle: {
                color: '#000000' // Ensure the color of the points matches the line
            },
            showSymbol: false,
        }

        optionData.chartSeries.push(data);
    }
    console.log('optionData:', optionData);
    return optionData;
})
//上一步
const previousStep = () => {
    router.push('/');
}
//下一步
const nextStep = () => {
    if (store.value.solutionUserPicked.irrigationCombination != null) {

        router.push('/step4');
    } else {
        // alert('請選擇灌區組合');
        Swal.fire({
            title: '請選擇灌區組合方案!',
            // text: '',
            icon: 'warning',
            confirmButtonText: '確認',
            // showConfirmButton: false,
        })
    }
}

</script>

<style scoped lang="scss">
// .card_groups {
//     cursor: pointer;
//     border-radius: 10px;

//     &:hover {
//         .item {
//             /* 添加過渡效果 */
//             transition: all 0.5s ease-in-out;
//             /* 添加陰影 */
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
//             /* 微微浮起 */
//             transform: translateY(-2px);
//         }
//     }
// }
.item {
    cursor: pointer;

    &:hover {
        /* 添加過渡效果 */
        transition: all 0.5s ease-in-out;
        /* 添加陰影 */
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.6);
        /* 微微浮起 */
        transform: translateY(-5px);
    }
}

.btn_wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent #ffffff transparent;
}

// 以下控制上方echarts區域動畫
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out;
    overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    max-height: 600px;
    /* 根據內容高度調整 */
    opacity: 1;
}
</style>