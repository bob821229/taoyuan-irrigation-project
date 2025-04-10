<template>
     <Drawer style="width: 100vw;" v-model:visible="visibleLeft" header="整田期錯開說明" position="left">
        <iframe src="https://tiwrar-my.sharepoint.com/personal/johnny_chen_triwra_org_tw/_layouts/15/Doc.aspx?sourcedoc={5c76151a-4815-4576-a344-7860712b0d98}&amp;action=embedview&amp;wdAr=1.7777777777777777" 
                style="width: 100%; height: 100%" frameborder="0">
                <!-- 這是 <a target="_blank" href="https://office.com/webapps">Office</a> 提供的內嵌 <a target="_blank" href="https://office.com">Microsoft Office</a> 簡報。 -->
            </iframe>
    </Drawer>
    <div class="row">
        
        <div class="col-12">
            <Card class='mb-2' style="">
                <template #header></template>
                <template #title></template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <div class="col-12 text-end">
                        <!-- <span  @click="visibleLeft = true" class="pi pi-file-pdf" /> -->
                        <span  @click="visibleLeft = true" class="pi pi-book" />
                        <!-- <Button icon="pi pi-file-pdf" @click="visibleLeft = true"></Button> -->
                    </div>
                    <SimpleEchart :chart-width="'100%'" :chart-height="'80vh'"
                        :chart-x-axis="scatterChartOptionData.chartXAxis"
                        :chart-y-axis="scatterChartOptionData.chartYAxis"
                        :chart-series="scatterChartOptionData.chartSeries"
                        :chart-title="scatterChartOptionData.chartTitle" :on-click-callback="chartClickCallback">
                    </SimpleEchart>
                </template>
            </Card>
        </div>
        <div class="col-12">
            <div class=" btn_wrap">
                <Button @click="previousStep">上一步</Button>
                <!-- <Button @click="nextStep">下一步</Button> -->
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
import { WaterNeedsCalculator } from '@/utils/WaterNeedsCalculator'
import { AgricultureCalendar } from '@/utils/AgricultureCalendar'
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';


import { ApiCaller } from "@/utils/ApiCallerModule";
import { AxiosDatabaseTables } from '@/utils/AxiosDatabaseTables';

import axios from 'axios';
import Enumerable from 'linq'

import { RouterLink, RouterView, useRouter } from 'vue-router'
const visibleLeft = ref(false);
// 取得路由
const router = useRouter();
//上一步
const previousStep = () => {
    router.push('/step2');
}
//下一步
const nextStep = () => {
    router.push('/step4_2');
}

//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);

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
// 把資料結構轉換成畫scatter echarts的格式
const scatterChartOptionData = computed(() => {
    if (sourceList.value == null) {
        return {
            chartXAxis: {
                name: '尖峰用水量(萬噸)',
                type: 'value',
                position: 'bottom',
                alignTicks: true,
                nameLocation: 'middle',  // 設定 x 軸名稱在中間
                nameGap: 30,  // 設定 x 軸名稱與 x 軸的垂直間距 50px
                // min: 1000, 
                // max: 1700, 
                // min: minX - 100,
                // max: maxX + 100,
            },
            chartYAxis: {
                name: '16旬後用水(萬噸)',
                type: 'value',
                nameLocation: 'middle',  // 設定 y 軸名稱在中間
                nameGap: 50,  // 設定 y 軸名稱與 y 軸的水平間距 20px
                nameTextStyle: {
                    //align: 'center',  // 文字對齊設定
                    verticalAlign: 'middle'
                },
                position: 'left',
                // min: minY - 100,
                // max: maxY - 100
                // min: 3000, 
                // max: 7000, 

                //max: 1400,
            },
            chartSeries: [],
            chartTitle: "目前無資料",
        };
    }

    //   let sourceList = sourceList.value;
    let q = Enumerable.from(sourceList.value);
    let minX = q.min(f => f.peak);
    let maxX = q.max(f => f.peak);
    let minY = q.min(f => f.sumAfter16);
    let maxY = q.max(f => f.sumAfter16);

    let series = sourceList.value.map((f, idx) => {
        let obj = {
            value: [f.peak, f.sumAfter16],
            //itemStyle: {color: 'red'}
        };

        let q = Enumerable.from(irrigationStartDelayListData.value.combinationList).where(itx => itx.seq == f.seq).firstOrDefault();
        if (q != null) {
            obj.itemStyle = { color: 'red' };
            obj.symbolSize = 15;
            obj.combo = q;
        }
        return obj;
    }
    );
    console.log('scatterChartOptionData', series);
    let chartSeries = [
        {
            name: `${irrigationStartDelayListData.value.solutionName} - 最大尖峰用水量與16旬後用水量之關係`,
            type: 'scatter',
            data:
                series,
            // [
            //     [10, 20],
            //     [15, 25],
            //     [20, 30],
            //     [25, 35],
            //     [30, 40]
            // ],
            symbolSize: 5
        }
    ];


    let option = {
        chartXAxis: {
            name: '尖峰用水量(萬噸)',
            type: 'value',

            position: 'bottom',
            alignTicks: true,
            nameLocation: 'middle',  // 設定 x 軸名稱在中間
            nameGap: 30,  // 設定 x 軸名稱與 x 軸的垂直間距 50px
            // min: 1000, 
            // max: 1700, 
            min: minX - 100,
            max: maxX + 100,
        },
        chartYAxis: {
            name: '16旬後用水(萬噸)',
            type: 'value',

            nameLocation: 'middle',  // 設定 y 軸名稱在中間
            nameGap: 50,  // 設定 y 軸名稱與 y 軸的水平間距 20px
            nameTextStyle: {
                //align: 'center',  // 文字對齊設定
                verticalAlign: 'middle'
            },
            position: 'left',

            min: minY - 100,
            max: maxY - 100
            // min: 3000, 
            // max: 7000, 

            //max: 1400,
        },
        chartSeries: chartSeries,
        chartTitle: null,
    }
    option.chartYAxis.max = null;
    //   if (this.ifSameScale) {
    //     option.chartYAxis.max = this.chartYMaxScale;
    //   } else {
    //   }

    return option;
})
async function chartClickCallback(param) {
    console.log('chartClickCallback!', param);
    //判斷是否有資料，若無則不執行
    if (param.data.combo != null) {
        console.log(param.data.combo);
        store.value.comboPicked = param.data.combo;
        store.value.solutionUserPicked.delay2IrrigationCombination = param.data.combo;
        //在第3步整田期算配水量時，需要用原始資料在前端自行錯誤用水計算
        let irrigationGroupList = Enumerable.from(store.value.solutionUserPicked.irrigationCombination.groupList).select(f => f['灌區']).toArray();
        let matchToUserPickedCombinationBaseData = {};
        let keys = Object.keys(store.value.compareSimulationData.baseData);
        keys.forEach(datasetName => {
            matchToUserPickedCombinationBaseData[datasetName] =
                Enumerable.from(store.value.compareSimulationData.baseData[datasetName]).where(f => irrigationGroupList.includes(f['灌區'])).toArray();
        });

        store.value.solutionUserPicked.baseData = matchToUserPickedCombinationBaseData;
        // ========================================

        store.value.comboPicked.totalWaterUsage = Enumerable.from(param.data.combo.tendaysWaterUsageList).sum(f => f.waterUsage);
        //alert(param.seriesType);


        store.value.userSettings.irrigationOrganizationTendaysWaterUsage = store.value.comboPicked.tendaysWaterUsageList;
        store.value.userSettings.irrigationOrganizationTendaysWaterUsage =
            (new AgricultureCalendar()).transferToTendaysField(store.value.comboPicked.tendaysWaterUsageList, 'tendaysNumber', 'waterUsage');
        let pickedIrrigationGroupList = store.value.comboPicked.solutionName.split('、');

        console.log('irrigationOrganizationTendaysWaterUsage', store.value.userSettings.irrigationOrganizationTendaysWaterUsage);
        let _waterNeedsCalculator = new WaterNeedsCalculator();
        let c = await loadDataFromCombinationUserPicked(_waterNeedsCalculator, store.value.userSettings,
            (_baseData) => {
                let _filterData = Enumerable.from(_baseData).where(
                    f => pickedIrrigationGroupList.includes(f['灌區'])

                ).toArray();

                return _filterData;
            },

        );
        //console.log('this.combinationUserPickedSimulationData', c);
        store.value.simulationDataHere.baseData = c.baseData;     //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
        store.value.simulationDataHere.outcomes = c.outcomes;
        store.value.simulationDataHere.reservoirWaterStoarage = c.reservoirWaterStoarage;
        store.value.simulationDataHere.areaWaterNeedsByIrrigationGroup = c.areaWaterNeedsByIrrigationGroup;
        // 跳轉到step4_2
        router.push('/step4_2');
    }


}
</script>

<style scoped lang="scss">
.pi {
    cursor: pointer;
}
.btn_wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>