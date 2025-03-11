<template>

    <div class="row">
        <div class="col-12" v-if="store.comboPicked != null">
            <Card class='mb-2' style="">
                <template #header></template>
                <template #title></template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <div class="row">
                        <!-- 開灌時間表格 -->
                        <div class="col-12">
                            <table class="table table-border table-irrigation-start-delay">
                                <thead>
                                    <tr>
                                        <th style="width:250px;">灌區</th>
                                        <th v-for="(irrigationGroup, wIdx) in store.comboPicked.workstationProvidingStartList.map(f => f.irrigationGroup)"
                                            :key="wIdx">{{ irrigationGroup }}</th>
                                    </tr>
                                    <tr>
                                        <th style="width:250px;">工作站</th>
                                        <th v-for="(workstation, wIdx) in store.comboPicked.workstationProvidingStartList.map(f => f.workstation)"
                                            :key="wIdx">{{ workstation }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="width:250px;">開灌時間(旬)</td>
                                        <td v-for="(tendaysNumber, wIdx) in store.comboPicked.workstationProvidingStartList.map(f => f.tendaysNumber)"
                                            :key="wIdx">
                                            {{ tendaysNumber }}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td
                                            :colspan="(store.comboPicked.workstationProvidingStartList.map(f => f.tendaysNumber).length + 1)">
                                            <div class="row">
                                                <div class="col-sm-12 col-md-4">
                                                    <label class="fw-bold">尖峰用水量：</label>第<span class="text-danger">{{
                                                        store.comboPicked.waterPeakTendaysNumber }}</span>旬
                                                    <span class="text-danger">{{
                                                        Math.round(store.comboPicked.waterUsagePeak) }}</span> 萬噸
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <label class="fw-bold">第16旬後用水：</label><span class="text-danger">{{
                                                        Math.round(store.comboPicked.waterUsageSummaryAfterTendays16)
                                                        }}</span>
                                                    萬噸
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <label class="fw-bold">總用水量：</label><span class="text-danger">{{
                                                        Math.round(store.comboPicked.totalWaterUsage) }}</span>
                                                    萬噸
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                </tfoot>
                            </table>
                        </div>
                        <div class="col-12 d-flex gap-2" style="text-align: right;align-self: center;justify-content: flex-end;font-weight: bold;">
                            全畫面 : <ToggleSwitch v-model="checked" />
                        </div>
                        <!-- 每旬配水圖 -->
                        <div class="col-12" v-if="checked">
                            <SimpleEchart v-if="store.comboPickedChartOption != null" :chart-width="'100%'" :chart-height="'80vh'"
                        :chart-x-axis="store.comboPickedChartOption.chartXAxis"
                        :chart-y-axis="store.comboPickedChartOption.chartYAxis"
                        :chart-series="store.comboPickedChartOption.chartSeries"
                        :chart-title="store.comboPickedChartOption.chartTitle"></SimpleEchart>
                        </div>
                        <!-- 50%的每旬配水圖 -->
                        <div class="col-6" v-if="!checked">
                            <SimpleEchart v-if="store.comboPickedChartOption != null" :chart-width="'100%'" :chart-height="'80vh'"
                        :chart-x-axis="store.comboPickedChartOption.chartXAxis"
                        :chart-y-axis="store.comboPickedChartOption.chartYAxis"
                        :chart-series="store.comboPickedChartOption.chartSeries"
                        :chart-title="store.comboPickedChartOption.chartTitle"></SimpleEchart>
                        </div>
                        <!-- 50%的比較圖 -->
                        <div class="col-6" v-if="!checked">
                            <SimpleEchart :chart-width="'100%'" :chart-height="'80vh'"
                        :chart-x-axis="store.irragationTrendChartData2.chartXAxis"
                        :chart-y-axis="store.irragationTrendChartData2.chartYAxis"
                        :chart-series="store.irragationTrendChartData2.chartSeries"
                        :chart-title="store.irragationTrendChartData2.chartTitle"></SimpleEchart>
                        </div>
                    </div>

                    
                </template>
            </Card>


        </div>
        <!-- 比較圖 -->
        <div class="col-12" v-if="checked" >
            <Card class='mb-2'  v-if="store.irragationTrendChartData2 != null">
                <template #header></template>
                <template #title></template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <SimpleEchart 
                    :chart-width="'100%'" :chart-height="'80vh'"
                        :chart-x-axis="store.irragationTrendChartData2.chartXAxis"
                        :chart-y-axis="store.irragationTrendChartData2.chartYAxis"
                        :chart-series="store.irragationTrendChartData2.chartSeries"
                        :chart-title="store.irragationTrendChartData2.chartTitle"></SimpleEchart>
                </template>
            </Card>
        </div>
        <!-- 按鈕 -->
        <div class="col-12">
            <div class=" btn_wrap">
                <Button @click="previousStep">上一步</Button>
                <Button @click="nextStep">埤塘聯合運用</Button>
            </div>
        </div>
    </div>

    <!-- <hr>
    solutionName:{{ irrigationStartDelayListData.solutionName }}
    <hr>
    jsonFilename:{{ irrigationStartDelayListData.jsonFilename }}
    <hr>
    scatterChartOptionData:{{scatterChartOptionData}}
    <hr>
    irrigationStartDelayListData:{{ irrigationStartDelayListData }} -->
</template>

<script setup>
import { ref, watchEffect, onMounted, computed } from 'vue'
import SimpleEchart from '../components/SimpleEchart.vue';

import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';

import { RouterLink, RouterView, useRouter } from 'vue-router'

import { ApiCaller } from "@/utils/ApiCallerModule";
import { AxiosDatabaseTables } from '@/utils/AxiosDatabaseTables';

import axios from 'axios';
import Enumerable from 'linq'
const checked = ref(false);
// 取得路由
const router = useRouter();
//上一步
const previousStep = () => {
    router.push('/step4');
}
//下一步
const nextStep = () => {
    router.push('/step5');
}
//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);

const solutionName = ref(null)
const sourceList4RecordsList = ref(null)
const path = computed(() => {

    return 123
})
// 根據step2種植密度+選取的灌區 篩選出對應的json檔案
function init() {
    Enumerable.from(store.value.sourceList2RecordsList)
}
//篩選出對應資料的json檔案
const irrigationStartDelayListData = computed(() => {
    let tmp = store.value.databaseTables['整田期錯開散佈圖'];
    console.log('整田期錯開散佈圖', tmp);
    let list = Enumerable.from(tmp)
        //.groupBy(f => `${f.solutionName}||${f.dataSize}`)
        .where(f => f.plantingYear == store.value.userSettings.step2.baseDataPath.land_using_frequency && f.solutionName == store.value.solutionUserPicked.irrigationCombination.title)
        .select(
            f => {
                //let keyList = g.key().split('||');
                let solutionGroup = f.solutionName;//keyList[0];
                let solutionGroupList = solutionGroup.split('、');
                let dataSize = f.dataSize;
                let obj = {
                    //   '桃一': (solutionGroup.indexOf('桃一') >= 0) ? 'V' : '',
                    //   '桃二': (solutionGroup.indexOf('桃二') >= 0) ? 'V' : '',
                    //   '桃三': (solutionGroup.indexOf('桃三') >= 0) ? 'V' : '',
                    //   '石一': (solutionGroup.indexOf('石一') >= 0) ? 'V' : '',
                    //   '石二': (solutionGroup.indexOf('石二') >= 0) ? 'V' : '',
                    //   '工作站': Enumerable.from(store.value.databaseTables['工作站']).where(f => solutionGroupList.includes(f['分類'])).count(),
                    //   '整田期錯開組合數(桃園符合灌溉順序)': dataSize, //Number(keyList[1]), //Number(keyList[1]).toLocaleString()
                    jsonFilename: f.jsonFilename,
                    combinationList: f.combinationList,
                    solutionName: solutionGroup,
                };
                return obj;
            }
        ).toArray();
    return list[0];
})
const sourceList = ref(null)

async function fetchSourceList() {
    try {
        const api = new AxiosDatabaseTables()
        const result = await api.getApiData(`/data${irrigationStartDelayListData.value.jsonFilename}`, 'sourceList')
        sourceList.value = result.data
    } catch (error) {
        console.error('Error fetching data:', error)
        sourceList.value = null
    }
}

onMounted(() => {
    fetchSourceList()
})
async function chartClickCallback(param) {
    console.log('chartClickCallback', param);
    if (param.data.combo != null) {
        console.log(param.data.combo);
        this.comboPicked = param.data.combo;
        //alert(param.seriesType);


        this.userSettings.irrigationOrganizationTendaysWaterUsage = this.comboPicked.tendaysWaterUsageList;
        // let ttt = (new AgricultureCalendar()).transferToTendaysField(this.userSettings.irrigationOrganizationTendaysWaterUsage, 'tendaysNumber', 'waterUsage');
        //console.log('chartClickCallback', this.userSettings.irrigationOrganizationTendaysWaterUsage, ttt);
        this.userSettings.irrigationOrganizationTendaysWaterUsage =
            (new AgricultureCalendar()).transferToTendaysField(this.comboPicked.tendaysWaterUsageList, 'tendaysNumber', 'waterUsage');
        let pickedIrrigationGroupList = this.comboPicked.solutionName.split('、');

        console.log('irrigationOrganizationTendaysWaterUsage', this.userSettings.irrigationOrganizationTendaysWaterUsage);
        let _waterNeedsCalculator = new WaterNeedsCalculator();
        let c = await loadDataFromCombinationUserPicked(_waterNeedsCalculator, this.userSettings,
            (_baseData) => {
                let _filterData = Enumerable.from(_baseData).where(
                    f => pickedIrrigationGroupList.includes(f['灌區'])

                ).toArray();

                return _filterData;
            },

        );
        //console.log('this.combinationUserPickedSimulationData', c);
        this.simulationDataHere.baseData = c.baseData;     //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
        this.simulationDataHere.outcomes = c.outcomes;
        this.simulationDataHere.reservoirWaterStoarage = c.reservoirWaterStoarage;
        this.simulationDataHere.areaWaterNeedsByIrrigationGroup = c.areaWaterNeedsByIrrigationGroup;

        scrollTo('irrigation-schedule-intro-map');
    }


}
</script>

<style scoped lang="scss">
table {
    overflow: hidden;
    border-radius: 10px 10px 0px 0px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
    font-family: 'Oswald', sans-serif;
    border-collapse: collapse;

}

th {
    background-color: #009879;
    color: #ffffff;
    // width: 25vw;
    //   height:75px;
    text-align: center;
}

td {
    background-color: #ffffff;
    // width: 25vw;
    // height: 50px;
    text-align: center;
}

tr {
    border-bottom: 1px solid #dddddd;
}

tr:last-of-type {
    border-bottom: 2px solid #009879;
}

tr:nth-of-type(even) td {
    background-color: #f3f3f3;
}

.btn_wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>