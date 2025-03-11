<template>
    <div class="row">
        <div class="col-12" v-if="store.comboPicked != null">
            <Card class='mb-2' style="">
                <template #header></template>
                <template #title></template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <div class="row">
                        <!-- 表格 -->
                        <div class="col-12">
                            <table class="table table-border table-irrigation-start-delay">
                                <thead>
                                    <tr>
                                        <th>項目</th>
                                        <th>15旬含以前總水量(萬噸)</th>
                                        <th>16旬含以後總水量(萬噸)</th>
                                        <th>總水量(萬噸)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in summaryTableData" :key="item['項目']">
                                        <td>{{ item[`項目`] }}</td>
                                        <td>{{ item[`15旬含以前總水量(萬噸)`].toLocaleString() }}</td>
                                        <td>{{ item[`16旬含以後總水量(萬噸)`].toLocaleString() }}</td>
                                        <td>{{ item[`總水量(萬噸)`].toLocaleString() }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- 全畫面切換鈕 -->
                        <div class="col-12 d-flex gap-2"
                            style="text-align: right;align-self: center;justify-content: flex-end;font-weight: bold;">
                            全畫面 :
                            <ToggleSwitch v-model="checked" />
                        </div>
                        <!-- 每旬配水圖 -->
                        <div class="col-12" v-if="checked">
                            <SimpleEchart v-if="delayWaterGivingVsWaterAssignmentChartOptionData != null"
                                :chart-width="'100%'" :chart-height="'80vh'"
                                :chart-x-axis="delayWaterGivingVsWaterAssignmentChartOptionData.chartXAxis"
                                :chart-y-axis="delayWaterGivingVsWaterAssignmentChartOptionData.chartYAxis"
                                :chart-series="delayWaterGivingVsWaterAssignmentChartOptionData.chartSeries"
                                :chart-title="delayWaterGivingVsWaterAssignmentChartOptionData.chartTitle">
                            </SimpleEchart>
                        </div>
                        <!-- 50%的每旬配水圖 -->
                        <div class="col-6" v-if="!checked">
                            <SimpleEchart v-if="delayWaterGivingVsWaterAssignmentChartOptionData != null"
                                :chart-width="'100%'" :chart-height="'80vh'"
                                :chart-x-axis="delayWaterGivingVsWaterAssignmentChartOptionData.chartXAxis"
                                :chart-y-axis="delayWaterGivingVsWaterAssignmentChartOptionData.chartYAxis"
                                :chart-series="delayWaterGivingVsWaterAssignmentChartOptionData.chartSeries"
                                :chart-title="delayWaterGivingVsWaterAssignmentChartOptionData.chartTitle">
                            </SimpleEchart>
                        </div>
                        <!-- 50%的比較圖 -->
                        <div class="col-6" v-if="!checked">
                            <SimpleEchart :chart-width="'100%'" :chart-height="'80vh'"
                                :chart-x-axis="irragationTrendChartData.chartXAxis"
                                :chart-y-axis="irragationTrendChartData.chartYAxis"
                                :chart-series="irragationTrendChartData.chartSeries"
                                :chart-title="irragationTrendChartData.chartTitle"></SimpleEchart>
                        </div>
                    </div>

                </template>
            </Card>

        </div>
        <div class="col-12" v-if="checked">
            <Card class='mb-2' style="" v-if="irragationTrendChartData != null">
                <template #header></template>
                <template #title></template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <SimpleEchart :chart-width="'100%'" :chart-height="'80vh'"
                        :chart-x-axis="irragationTrendChartData.chartXAxis"
                        :chart-y-axis="irragationTrendChartData.chartYAxis"
                        :chart-series="irragationTrendChartData.chartSeries"
                        :chart-title="irragationTrendChartData.chartTitle"></SimpleEchart>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, computed, watch } from 'vue'
import SimpleEchart from '../components/SimpleEchart.vue';

import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';

import { RouterLink, RouterView, useRouter } from 'vue-router'

import { ApiCaller } from "@/utils/ApiCallerModule";
import { AxiosDatabaseTables } from '@/utils/AxiosDatabaseTables';
import { AgricultureCalendar } from '@/utils/AgricultureCalendar';
import { WaterNeedsCalculator } from '@/utils/WaterNeedsCalculator';
import { WaterGivingByReservoirCalculator } from '@/utils/WaterGivingByReservoirCalculator';

import axios from 'axios';
import Enumerable from 'linq'
// 是否顯示全畫面
const checked = ref(false);
//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);
onMounted(async () => {
    await init()
})

const reservoirWaterGivingWaterGroupArrayBaseData = computed(() => {
    if (chartList.value == null) { return null }
    let list = Enumerable.from(chartList.value)
        .groupBy((f) => `${f.number}||${f.text}`)
        .select((g) => {
            let keyArray = g.key().split("||");
            let obj = {
                text: keyArray[1],
                tendaysNumber: keyArray[0],
                waterUsage: g.sum((f) =>
                    f.waterUsage == null ? 0 : f.waterUsage
                ),
                currentPondRemain: g.sum((f) =>
                    f.currentPondRemain == null
                        ? 0
                        : f.currentPondRemain
                ),
                reservoirGiving: g.sum((f) =>
                    f.reservoirGiving == null ? 0 : f.reservoirGiving
                ),
            };
            return obj;
        })
        .toArray();

    return list;
})

const delayWaterGivingVsWaterAssignmentChartOptionData = computed(() => {

    let options = deepCopy(store.value.comboPickedChartOption)
    let series = reservoirWaterGivingWaterGroupArrayBaseData.value.map(
        (f) => f.reservoirGiving
    );
    let xAxisData =
        reservoirWaterGivingWaterGroupArrayBaseData.value.map(
            (f) => f.tendaysNumber
        );
    options.chartXAxis.data = xAxisData;
    options.chartSeries.push({
        name: "供水量",
        type: "bar",
        data: series,
        //  itemStyle: {
        //     color: "red",
        // },
    });
    return options
})
const irragationTrendChartData = computed(() => {
    let options = deepCopy(store.value.irragationTrendChartData2)
    let keyList = Object.keys(
        store.value.combinationUserPickedSimulationData
            .reservoirWaterStoarage.afterWaterGivingSimulation
    );

    let dataObject = {};
    keyList.forEach((key) => {
        dataObject[key] =
            Math.round(
                store.value.combinationUserPickedSimulationData
                    .reservoirWaterStoarage
                    .afterWaterGivingSimulation[key]
            );
    });

    let combinationUserPickedList = Object.values(dataObject);

    options.chartSeries.push({
        name: "聯合運用埤塘", //'只供灌使用者挑選的灌區',//'平均五年判釋面積',
        type: "line",
        data: combinationUserPickedList,
        lineStyle: {
            color: "blue",
            //width: 5
        },
        itemStyle: {
            color: "blue", // Ensure the color of the points matches the line
        },
        showSymbol: false,
    });
    return options
})
const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}
const chartList = ref([]);
watch(chartList.value, (n) => {
    if (n.length > 0) {
        TT()
    }
})
const chartListForWaterAssignmentHasNoPond = ref(null);
const waterNeedsCalculatorForNoPond = ref(null);
async function init() {


    console.log(
        "store.value.solutionUserPicked.delay2IrrigationCombination",
        store.value.solutionUserPicked.delay2IrrigationCombination
    );
    let agricultureCalendar = new AgricultureCalendar();
    let branchInflowsByTendays =
        agricultureCalendar.getDelayToIrrigateTenDaysPeriodDataList({
            tenDaysNumberBase: 4, //基本旬
            tendaysToStart: 4, //從第 tendaysToStart 旬開始
            tenDaysNumberEnd: 24,//整個期間在第 tenDaysNumberEnd 結束
            sourceDataList: {
                // '支線取入量(先用埤塘水，用完再取支線)': store.value.solutionUserPicked.baseData['支線取入量(先用埤塘水，用完再取支線)']
                "大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]":
                    store.value.solutionUserPicked.baseData[
                    "大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]"
                    ],
                // .filter(f=>
                //   //f['小組別'] ==
                //   //'蚵殼港圳十一號池'
                //   //'蚵殼港圳十號池'
                //   //'光復圳一支一號池'
                //   //'永安'
                //   ['永安', '光復圳一支一號池'].includes(f['小組別'])
                // )

                //'大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]': store.value.solutionUserPicked.baseData['大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]'],
            },
            outputMappingFields: [
                {
                    //listPropertyName: '支線取入量(先用埤塘水，用完再取支線)',
                    listPropertyName:
                        "大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]",
                    outputFieldName: "waterUsage",
                    outputObjectNameByDataSourceFieldName: "小組別",
                },
            ],
        });
    console.log("branchInflowsByTendays", branchInflowsByTendays);
    // 支線名稱
    let keys = Object.keys(branchInflowsByTendays);

    keys.forEach(async (key, idx) => {
        // 支線 本身的資料
        let irrigationSchedule = branchInflowsByTendays[key];

        let _agricultureCalendar = new AgricultureCalendar();
        let finalIrrigationSchedule =
            _agricultureCalendar.getTenDaysPeriodList({
                tenDaysNumberStart: 4,
                tenDaysNumberEnd: 24,
            });
        // 水利小組別的資料
        let data = Enumerable.from(
            store.value.solutionUserPicked.baseData[
            "baseWaterDataByWaterGroup"
            ]
        )
            .where((f) => f["小組別"] == key)
            .firstOrDefault();

        let workstationStart = Enumerable.from(
            store.value.solutionUserPicked.delay2IrrigationCombination
                .workstationProvidingStartList
        )
            .where(
                (f) => `${f.workstation}工作站` == data["工作站名稱"]
            )
            .firstOrDefault();
        // console.log('@# 工作站:', data["工作站名稱"], `小組別:${key}`, data);
        // console.log('@# workstationStart:', workstationStart);
        let start = 4; //開始旬
        let delays = workstationStart.tendaysNumber - start; //(data['工作站名稱'] == '湖口工作站' ? 0 : 3);  //延後幾旬
        let currentIdx = 0;
        finalIrrigationSchedule.forEach((item) => {
            // item.waterUsage = 0;// 新加的+
            if (item.number >= start + delays) {
                item.waterUsage =
                    irrigationSchedule[currentIdx].waterUsage;
                currentIdx++;
            }
        });
        console.log(
            delays,
            "finalIrrigationSchedule",
            finalIrrigationSchedule
        );

        let totalPondStorage =
            (data["埤塘總庫容(m3)"] == null
                ? 0
                : data["埤塘總庫容(m3)"]) / 10000;
        let currentPondStorage =
            data["埤塘目前庫容比率"] == null
                ? 0
                : totalPondStorage * data["埤塘目前庫容比率"];
        console.log(
            data["小組別"],
            data["埤塘總庫容(m3)"],
            data["埤塘目前庫容比率"],
            data["埤塘目前庫容(m3)"],
            totalPondStorage,
            currentPondStorage
        );
        let waterGivingByReservoirCalculator =
            new WaterGivingByReservoirCalculator();
        await waterGivingByReservoirCalculator.calculateByFieldToLowerPeakWaterUsage(
            finalIrrigationSchedule,
            "waterUsage",
            currentPondStorage,
            totalPondStorage
        );
        let idvOutcomes =
            await waterGivingByReservoirCalculator.getOutcomes();
        // console.log("idvOutcomes:", idvOutcomes);
        //outList.push(idvOutcomes);
        idvOutcomes.tendaysStaticsList.forEach((item) => {
            chartList.value.push(item);
        });
    });

    // TT();
}
async function TT() {
    //alert('tt');

    //重新模擬一次
    let _waterNeedsCalculator = new WaterNeedsCalculator();

    store.value.userSettings.irrigationOrganizationTendaysWaterUsage =
        new AgricultureCalendar().transferToTendaysField(
            store.value.solutionUserPicked.delay2IrrigationCombination
                .tendaysWaterUsageList,
            "tendaysNumber",
            "waterUsage"
        );

    store.value.userSettings.reservoirGivingTendaysWater =
        new AgricultureCalendar().transferToTendaysField(
            reservoirWaterGivingWaterGroupArrayBaseData.value,
            "tendaysNumber",
            "reservoirGiving"
        );

    console.log(
        "this.userSettings.irrigationOrganizationTendaysWaterUsage",
        store.value.userSettings.irrigationOrganizationTendaysWaterUsage,
        store.value.userSettings.reservoirGivingTendaysWater
    );

    let c = await loadDataFromCombinationUserPicked(
        _waterNeedsCalculator,
        store.value.userSettings,
        (_baseData) => {
            let _irrigationGroupList =
                store.value.solutionUserPicked.irrigationCombination.groupList.map(
                    (f) => f["灌區"]
                );
            console.log(
                "filter: _irrigationGroupList",
                _irrigationGroupList
            );
            let _filterData = Enumerable.from(_baseData)
                .where(
                    //f => f['灌區'] == '桃一'
                    (f) => _irrigationGroupList.includes(f["灌區"])
                )
                .toArray();

            return _filterData;
        }
    );

    console.log('this.combinationUserPickedSimulationData', c);
    store.value.combinationUserPickedSimulationData.baseData = c.baseData; //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
    store.value.combinationUserPickedSimulationData.outcomes = c.outcomes;
    store.value.combinationUserPickedSimulationData.reservoirWaterStoarage =
        c.reservoirWaterStoarage;
    store.value.combinationUserPickedSimulationData.areaWaterNeedsByIrrigationGroup =
        c.areaWaterNeedsByIrrigationGroup;


}

const summaryTableData = computed(() => {
    console.log(
        "summaryTableData, solutionUserPicked.delay2IrrigationCombination",
        store.value.solutionUserPicked.delay2IrrigationCombination
    );
    let tendaysNumberBefore = 15;
    let tendaysNumberAfter = tendaysNumberBefore + 1;
    let column2Title = `${tendaysNumberBefore}旬含以前總水量(萬噸)`;
    let column3Title = `${tendaysNumberAfter}旬含以後總水量(萬噸)`;
    let column4Title = "總水量(萬噸)";
    let waterAssignmentSummaryData = {
        項目: "原配水方案",
    };
    waterAssignmentSummaryData[column2Title] = Math.round(
        Enumerable.from(
            store.value.solutionUserPicked.delay2IrrigationCombination
                .tendaysWaterUsageList
        )
            .where((f) => f.tendaysNumber <= tendaysNumberBefore)
            .sum((f) => f.waterUsage)
    );
    waterAssignmentSummaryData[column3Title] = Math.round(
        Enumerable.from(
            store.value.solutionUserPicked.delay2IrrigationCombination
                .tendaysWaterUsageList
        )
            .where((f) => f.tendaysNumber >= tendaysNumberAfter)
            .sum((f) => f.waterUsage)
    );
    waterAssignmentSummaryData[column4Title] = Math.round(
        waterAssignmentSummaryData[column2Title] +
        waterAssignmentSummaryData[column3Title]
    );
    let waterGivingSummaryData = {
        項目: "供水方案",
    };
    waterGivingSummaryData[column2Title] = Math.round(
        Enumerable.from(
            reservoirWaterGivingWaterGroupArrayBaseData.value
        )
            .where((f) => f.tendaysNumber <= tendaysNumberBefore)
            .sum((f) => f.reservoirGiving)
    );
    waterGivingSummaryData[column3Title] = Math.round(
        Enumerable.from(
            reservoirWaterGivingWaterGroupArrayBaseData.value
        )
            .where((f) => f.tendaysNumber >= tendaysNumberAfter)
            .sum((f) => f.reservoirGiving)
    );
    waterGivingSummaryData[column4Title] = Math.round(
        waterGivingSummaryData[column2Title] +
        waterGivingSummaryData[column3Title]
    );
    let list = [waterAssignmentSummaryData, waterGivingSummaryData];
    return list;
})

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
</style>