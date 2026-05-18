<template>
    <Drawer style="width: 100vw;" v-model:visible="visibleLeft" header="農業可供水量推估說明" position="left">
            <iframe
                src="https://tiwrar-my.sharepoint.com/personal/johnny_chen_triwra_org_tw/_layouts/15/Doc.aspx?sourcedoc={707d3763-7ce8-4f88-a9d2-b84c4cc5b0d9}&amp;action=embedview&amp;wdAr=1.7777777777777777"
                style="width: 100%; height: 100%;padding: 10px;" frameborder="0">
            </iframe>
    </Drawer>
    <div class="row page_1 pt-2">
        <Card class='mb-2' style="">
            <template #header></template>
            <!-- <template #title>石門水庫灌溉方案決策模組</template> -->
            <!-- <template #subtitle>Card subtitle</template> -->
            <template #content>
                <div class="row">
                    <div class="col-12 text-end">
                        <!-- <span  @click="visibleLeft = true" class="pi pi-file-pdf" /> -->
                        <span  @click="visibleLeft = true" class="pi pi-book" />
                        <!-- <Button icon="pi pi-file-pdf" @click="visibleLeft = true"></Button> -->
                    </div>
                    <div class="col-md-9 col-ms-12">
                        <Card style="">
                            <template #subtitle>參數設定</template>
                            <template #content>
                                <div class="m-0">
                                    <div class="row">
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group">
                                                <div class="input-group">
                                                    <span class="input-group-text" id="basic-addon1">可供灌水量面積</span>
                                                    <select class="form-select"
                                                        v-model="comprehensiveDataStore.userSettings.step1.baseDataPath">
                                                        <option
                                                            v-for="obj in comprehensiveDataStore.uiSettings.baseDataPlantingAreaPathList"
                                                            :value="obj" :key="obj.value">
                                                            {{ obj.text }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group">
                                                <div class="input-group-text">
                                                    期作別
                                                </div>
                                                <div class="form-check form-check-inline mt-2 ms-2"
                                                    v-for="(obj, idx) in comprehensiveDataStore.uiSettings.farmingPeriodList"
                                                    :key="idx">
                                                    <input class="form-check-input" type="radio"
                                                        :id="'cbkFarmingPeriod' + idx" name="cbkFarmingPeriod"
                                                        :value="obj.value"
                                                        v-model="comprehensiveDataStore.userSettings.step1.farmingPeriod">
                                                    <label class="form-check-label" :for="'cbkFarmingPeriod' + idx">{{
                                                        obj.text }}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">模擬時間：</span>
                                                <select class="form-select"
                                                    v-model="comprehensiveDataStore.userSettings.step1.decisionMakingDate"
                                                    @change="setSimulationWaterStorage">
                                                    <option :value="null" disabled>請選擇</option>
                                                    <option
                                                        v-for="obj in comprehensiveDataStore.uiSettings.decisionMakingDateList"
                                                        :value="obj.value" :key="obj.value">{{ obj.text }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">模擬時間蓄水量：</span>
                                                <input type="number" class="form-control text-end"
                                                    v-model="comprehensiveDataStore.userSettings.step1.simulationWaterStorage10kTons">
                                                <span class="input-group-text" id="basic-addon1">萬噸</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">民生公共用水量：</span>
                                                <input type="number" class="form-control text-end"
                                                    v-model="comprehensiveDataStore.userSettings.step1.publicWaterUsage10kTonsPerDay">
                                                <span class="input-group-text" id="basic-addon1">萬噸/日</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">安全蓄水量：</span>
                                                <input type="number" class="form-control text-end"
                                                    v-model="comprehensiveDataStore.userSettings.step1.safeWaterStorage10kTons">
                                                <span class="input-group-text" id="basic-addon1">萬噸</span>
                                            </div>
                                        </div>

                                    </div>
                                    模擬時間：{{ comprehensiveDataStore.userSettings.step1.decisionMakingDate
                                    }}，該時間的水庫的蓄水量：{{
                                        comprehensiveDataStore.userSettings.step1.simulationWaterStorage10kTons
                                            == null ? 0 :
                                            comprehensiveDataStore.userSettings.step1.simulationWaterStorage10kTons.toLocaleString()
                                    }}萬噸
                                </div>
                            </template>
                        </Card>
                    </div>
                    <div class="col-md-3 col-ms-12">
                        <Card class="mb-2 h-100">
                            <template #subtitle>超越機率入流量</template>
                            <template #content>
                                <div class="m-0">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1">期作總入流量：</span>
                                        <select class="form-select"
                                            v-model="comprehensiveDataStore.userSettings.step1.shimenReservoirInflowPredictionIndex">
                                            <option :value="obj.text"
                                                v-for="(obj, idx) in comprehensiveDataStore.uiSettings.inflowsIndexList"
                                                :key="idx">
                                                {{ obj.text }}</option>
                                        </select>
                                    </div>
                                </div>
                            </template>
                        </Card>

                    </div>

                </div>
            </template>
        </Card>
        <div class="col-12" style="display: flex;justify-content: space-between;align-items: center;">
            <h3 class="mb-0">埤塘水情</h3>
            <Button @click="clickGetResult">確定模擬</Button>
        </div>
    </div>
    <transition name="slide-fade">
        <div class="row">

            <div class="col-6" v-if="poundInfoList2 != null">
                <Card class="">
                    <template #header></template>
                    <template #title>
                        <div class="d-flex " style="justify-content: space-between;">
                            <h4 class="d-inline">
                                桃園管理處
                            </h4>
                            <span style="color: #64748b;font-size: 16px;font-weight: 400;">
                                更新日期：114-06-02
                            </span>
                        </div>
                    </template>
                    <template #subtitle>
                        <div class="text-end" @click="showAllPoundInfo1 = !showAllPoundInfo1">
                            <i v-if="!showAllPoundInfo1" style="width: 10px;height: 10px;"
                                class="pi pi-chevron-down"></i>
                            <i v-if="showAllPoundInfo1" style="width: 10px;height: 10px;" class="pi pi-chevron-up"></i>
                        </div>
                    </template>
                    <template #content>
                        <div class="row-container" :class="{ 'scrollable': !showAllPoundInfo1 }"
                            @wheel="handleWheelScroll">
                            <div class="row" :class="{ 'nowrap': !showAllPoundInfo1 }">
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-3" v-for="p in poundInfoList2"
                                    :key="p.ChannelName">
                                    <WaterBox :content="p.content" :title="p.ChannelName"
                                        :value="p.PercentageOfPondStorage" :waterCount="p.PondStorage"></WaterBox>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="col-6" v-if="poundInfoList != null">
                <Card class="">
                    <template #header></template>
                    <template #title>
                        <div class="d-flex " style="justify-content: space-between;">
                            <h4 class="d-inline">
                                石門管理處
                            </h4>
                            <span style="color: #64748b;font-size: 16px;font-weight: 400;">
                                更新日期：114-06-02
                            </span>
                        </div>
                    </template>
                    <template #subtitle>
                        <div class="text-end" @click="showAllPoundInfo2 = !showAllPoundInfo2">
                            <i v-if="!showAllPoundInfo2" style="width: 10px;height: 10px;"
                                class="pi pi-chevron-down"></i>
                            <i v-if="showAllPoundInfo2" style="width: 10px;height: 10px;" class="pi pi-chevron-up"></i>
                        </div>
                    </template>
                    <template #content>
                        <div class="row-container" :class="{ 'scrollable': !showAllPoundInfo2 }"
                            @wheel="handleWheelScroll1">
                            <div class="row" :class="{ 'nowrap': !showAllPoundInfo2 }">
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-3" v-for="p in poundInfoList"
                                    :key="p.ChannelName">
                                    <WaterBox :content="p.content" :title="p.ChannelName"
                                        :value="p.PercentageOfPondStorage" :waterCount="p.PondStorage"></WaterBox>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>

            </div>

        </div>
    </transition>


    <!-- reservoirWaterUnitAssignmentsByTendaysChartData:{{ comprehensiveDataStore.reservoirWaterUnitAssignmentsByTendaysChartData }} -->
    <!-- <hr> -->
    <!-- plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData:{{ comprehensiveDataStore.plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData }} -->
    <!-- <hr> -->
    <!-- minPlantingAreaAvailableToIrrigatedByReservoirWaterData:{{ comprehensiveDataStore.minPlantingAreaAvailableToIrrigatedByReservoirWaterData }} -->
    <!-- <hr> -->
    <!-- availableWaterForAgricultureData:{{ comprehensiveDataStore.availableWaterForAgricultureData }} -->
    <!-- simulationData:{{currentData.simulationData.outcomes}} -->
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
const visibleLeft = ref(false)
const showPoundInfo = ref(false)
const showAllPoundInfo1 = ref(false)
const showAllPoundInfo2 = ref(false)
const poundInfoList = ref(null)
const poundInfoList2 = ref(null)
const handleWheelScroll = (event) => {
    if(showAllPoundInfo1.value)return
    const container = event.currentTarget;
    if (container.scrollWidth > container.clientWidth) {
        event.preventDefault(); // 阻止預設滾動行為（避免垂直滾動）
        container.scrollLeft += event.deltaY; // 讓滾輪上下滾動轉為左右滾動
    }
};
const handleWheelScroll1 = (event) => {
    if(!showAllPoundInfo2.value){
        const container = event.currentTarget;
        if (container.scrollWidth > container.clientWidth) {
            event.preventDefault(); // 阻止預設滾動行為（避免垂直滾動）
            container.scrollLeft += event.deltaY; // 讓滾輪上下滾動轉為左右滾動
        }
    }
};
//取得 埤塘資訊
async function getPoundInfoByIrrigation() {
    try {
        // 石門
        let result = [
    {
        "IANo": null,
        "WorkStationId": "04001",
        "IAName": "石門",
        "WorkStationName": "八德",
        "ChannelName": "員樹林",
        "fileTime": "06/02",
        "PondCount": 69,
        "PondCapacity": 138.77,
        "PondStorage": 109.38,
        "PercentageOfPondStorage": 78.82,
        "previousFileTime": "05/19",
        "previousPondStorage": 109.63,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04002",
        "IAName": "石門",
        "WorkStationName": "中壢",
        "ChannelName": "中壢",
        "fileTime": "06/02",
        "PondCount": 22,
        "PondCapacity": 9.1,
        "PondStorage": 6.97,
        "PercentageOfPondStorage": 76.62,
        "previousFileTime": "05/19",
        "previousPondStorage": 6.98,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04002",
        "IAName": "石門",
        "WorkStationName": "中壢",
        "ChannelName": "平鎮",
        "fileTime": "06/02",
        "PondCount": 2,
        "PondCapacity": 1.51,
        "PondStorage": 1.16,
        "PercentageOfPondStorage": 76.62,
        "previousFileTime": "05/19",
        "previousPondStorage": 1.16,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04002",
        "IAName": "石門",
        "WorkStationName": "中壢",
        "ChannelName": "東勢",
        "fileTime": "06/02",
        "PondCount": 6,
        "PondCapacity": 0.75,
        "PondStorage": 0.57,
        "PercentageOfPondStorage": 76.62,
        "previousFileTime": "05/19",
        "previousPondStorage": 0.57,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04002",
        "IAName": "石門",
        "WorkStationName": "中壢",
        "ChannelName": "社子",
        "fileTime": "06/02",
        "PondCount": 6,
        "PondCapacity": 21.11,
        "PondStorage": 16.17,
        "PercentageOfPondStorage": 76.62,
        "previousFileTime": "05/19",
        "previousPondStorage": 16.2,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04002",
        "IAName": "石門",
        "WorkStationName": "中壢",
        "ChannelName": "南勢",
        "fileTime": "06/02",
        "PondCount": 3,
        "PondCapacity": 1.69,
        "PondStorage": 1.29,
        "PercentageOfPondStorage": 76.62,
        "previousFileTime": "05/19",
        "previousPondStorage": 1.3,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04002",
        "IAName": "石門",
        "WorkStationName": "中壢",
        "ChannelName": "埔頂",
        "fileTime": "06/02",
        "PondCount": 15,
        "PondCapacity": 41.69,
        "PondStorage": 31.95,
        "PercentageOfPondStorage": 76.62,
        "previousFileTime": "05/19",
        "previousPondStorage": 32,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04003",
        "IAName": "石門",
        "WorkStationName": "過嶺",
        "ChannelName": "過嶺",
        "fileTime": "06/02",
        "PondCount": 85,
        "PondCapacity": 226.02,
        "PondStorage": 180.16,
        "PercentageOfPondStorage": 79.71,
        "previousFileTime": "05/19",
        "previousPondStorage": 169.94,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04004",
        "IAName": "石門",
        "WorkStationName": "楊梅",
        "ChannelName": "大金山",
        "fileTime": "06/02",
        "PondCount": 4,
        "PondCapacity": 0.91,
        "PondStorage": 0.72,
        "PercentageOfPondStorage": 79.51,
        "previousFileTime": "05/19",
        "previousPondStorage": 0.72,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04004",
        "IAName": "石門",
        "WorkStationName": "楊梅",
        "ChannelName": "山溪",
        "fileTime": "06/02",
        "PondCount": 2,
        "PondCapacity": 4.64,
        "PondStorage": 3.69,
        "PercentageOfPondStorage": 79.51,
        "previousFileTime": "05/19",
        "previousPondStorage": 3.68,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04004",
        "IAName": "石門",
        "WorkStationName": "楊梅",
        "ChannelName": "山麓",
        "fileTime": "06/02",
        "PondCount": 9,
        "PondCapacity": 5.71,
        "PondStorage": 4.54,
        "PercentageOfPondStorage": 79.51,
        "previousFileTime": "05/19",
        "previousPondStorage": 4.54,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04004",
        "IAName": "石門",
        "WorkStationName": "楊梅",
        "ChannelName": "高山頂",
        "fileTime": "06/02",
        "PondCount": 3,
        "PondCapacity": 1.26,
        "PondStorage": 1,
        "PercentageOfPondStorage": 79.51,
        "previousFileTime": "05/19",
        "previousPondStorage": 1,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04004",
        "IAName": "石門",
        "WorkStationName": "楊梅",
        "ChannelName": "環頂",
        "fileTime": "06/02",
        "PondCount": 59,
        "PondCapacity": 114.41,
        "PondStorage": 90.97,
        "PercentageOfPondStorage": 79.51,
        "previousFileTime": "05/19",
        "previousPondStorage": 90.87,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04005",
        "IAName": "石門",
        "WorkStationName": "富岡",
        "ChannelName": "繞嶺",
        "fileTime": "06/02",
        "PondCount": 79,
        "PondCapacity": 378.81,
        "PondStorage": 324.42,
        "PercentageOfPondStorage": 85.64,
        "previousFileTime": "05/19",
        "previousPondStorage": 324.19,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04006",
        "IAName": "石門",
        "WorkStationName": "湖口",
        "ChannelName": "湖口",
        "fileTime": "06/02",
        "PondCount": 27,
        "PondCapacity": 46.07,
        "PondStorage": 35.18,
        "PercentageOfPondStorage": 76.36,
        "previousFileTime": "05/19",
        "previousPondStorage": 34.91,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "04006",
        "IAName": "石門",
        "WorkStationName": "湖口",
        "ChannelName": "繞嶺",
        "fileTime": "06/02",
        "PondCount": 8,
        "PondCapacity": 35.67,
        "PondStorage": 27.24,
        "PercentageOfPondStorage": 76.36,
        "previousFileTime": "05/19",
        "previousPondStorage": 27.02,
        "ChineseFileTime": "114/6/2"
    }
]
        let totalPondStorage = 0;
        let tatalPoundCapacity = 0;
        let TotalPoundStorageRate = 0;
        let totalPondStorage2 = 0;
        let tatalPoundCapacity2 = 0;
        let TotalPoundStorageRate2 = 0;
        result.forEach((item) => {
            item.content = `有效蓄水量`
            totalPondStorage += item.PondStorage;
            tatalPoundCapacity += item.PondCapacity;
            item.PercentageOfPondStorage = Math.round10(item.PercentageOfPondStorage)
        })
        // 桃園
        let result2 = [
    {
        "IANo": null,
        "WorkStationId": "03001",
        "IAName": "桃園",
        "WorkStationName": "桃園",
        "ChannelName": "1支線",
        "fileTime": "06/02",
        "PondCount": 4,
        "PondCapacity": 72.41,
        "PondStorage": 59.81,
        "PercentageOfPondStorage": 82.59,
        "previousFileTime": "05/12",
        "previousPondStorage": 59.81,
        "ChineseFileTime": "114/5/22"
    },
    {
        "IANo": null,
        "WorkStationId": "03002",
        "IAName": "桃園",
        "WorkStationName": "大竹",
        "ChannelName": "2支線",
        "fileTime": "06/02",
        "PondCount": 28,
        "PondCapacity": 341.38,
        "PondStorage": 293.67,
        "PercentageOfPondStorage": 86.03,
        "previousFileTime": "05/26",
        "previousPondStorage": 290.23,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03003",
        "IAName": "桃園",
        "WorkStationName": "大園",
        "ChannelName": "3支線",
        "fileTime": "06/02",
        "PondCount": 6,
        "PondCapacity": 42.43,
        "PondStorage": 35.93,
        "PercentageOfPondStorage": 84.67,
        "previousFileTime": "05/26",
        "previousPondStorage": 36.71,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03003",
        "IAName": "桃園",
        "WorkStationName": "大園",
        "ChannelName": "4支線",
        "fileTime": "06/02",
        "PondCount": 14,
        "PondCapacity": 149.22,
        "PondStorage": 134.9,
        "PercentageOfPondStorage": 90.4,
        "previousFileTime": "05/26",
        "previousPondStorage": 134.9,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03003",
        "IAName": "桃園",
        "WorkStationName": "大園",
        "ChannelName": "5支線",
        "fileTime": "06/02",
        "PondCount": 12,
        "PondCapacity": 147.49,
        "PondStorage": 114.25,
        "PercentageOfPondStorage": 77.46,
        "previousFileTime": "05/26",
        "previousPondStorage": 113.03,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03004",
        "IAName": "桃園",
        "WorkStationName": "大崙",
        "ChannelName": "6支線",
        "fileTime": "06/02",
        "PondCount": 12,
        "PondCapacity": 126.74,
        "PondStorage": 115.75,
        "PercentageOfPondStorage": 91.33,
        "previousFileTime": "05/20",
        "previousPondStorage": 114.15,
        "ChineseFileTime": "114/5/29"
    },
    {
        "IANo": null,
        "WorkStationId": "03004",
        "IAName": "桃園",
        "WorkStationName": "大崙",
        "ChannelName": "7支線",
        "fileTime": "06/02",
        "PondCount": 11,
        "PondCapacity": 198.95,
        "PondStorage": 163.13,
        "PercentageOfPondStorage": 82,
        "previousFileTime": "05/20",
        "previousPondStorage": 163.13,
        "ChineseFileTime": "114/5/29"
    },
    {
        "IANo": null,
        "WorkStationId": "03004",
        "IAName": "桃園",
        "WorkStationName": "大崙",
        "ChannelName": "8-1支線",
        "fileTime": "06/02",
        "PondCount": 5,
        "PondCapacity": 68.2,
        "PondStorage": 61.8,
        "PercentageOfPondStorage": 90.61,
        "previousFileTime": "05/20",
        "previousPondStorage": 61.8,
        "ChineseFileTime": "114/5/29"
    },
    {
        "IANo": null,
        "WorkStationId": "03005",
        "IAName": "桃園",
        "WorkStationName": "草漯",
        "ChannelName": "8支線",
        "fileTime": "06/02",
        "PondCount": 31,
        "PondCapacity": 410.97,
        "PondStorage": 391.57,
        "PercentageOfPondStorage": 95.28,
        "previousFileTime": "05/12",
        "previousPondStorage": 393.64,
        "ChineseFileTime": "114/5/21"
    },
    {
        "IANo": null,
        "WorkStationId": "03006",
        "IAName": "桃園",
        "WorkStationName": "新坡",
        "ChannelName": "10-1號池",
        "fileTime": "06/02",
        "PondCount": 1,
        "PondCapacity": 7.81,
        "PondStorage": 6.04,
        "PercentageOfPondStorage": 77.42,
        "previousFileTime": "05/21",
        "previousPondStorage": 7.22,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03006",
        "IAName": "桃園",
        "WorkStationName": "新坡",
        "ChannelName": "8-2號池",
        "fileTime": "06/02",
        "PondCount": 1,
        "PondCapacity": 4.66,
        "PondStorage": 4.36,
        "PercentageOfPondStorage": 93.74,
        "previousFileTime": "05/21",
        "previousPondStorage": 4.36,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03006",
        "IAName": "桃園",
        "WorkStationName": "新坡",
        "ChannelName": "9支線",
        "fileTime": "06/02",
        "PondCount": 15,
        "PondCapacity": 273.83,
        "PondStorage": 196.29,
        "PercentageOfPondStorage": 71.68,
        "previousFileTime": "05/21",
        "previousPondStorage": 195.11,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03007",
        "IAName": "桃園",
        "WorkStationName": "觀音",
        "ChannelName": "10支線",
        "fileTime": "06/02",
        "PondCount": 15,
        "PondCapacity": 346.94,
        "PondStorage": 279.71,
        "PercentageOfPondStorage": 80.62,
        "previousFileTime": "05/12",
        "previousPondStorage": 301.27,
        "ChineseFileTime": "114/5/21"
    },
    {
        "IANo": null,
        "WorkStationId": "03007",
        "IAName": "桃園",
        "WorkStationName": "觀音",
        "ChannelName": "11支線",
        "fileTime": "06/02",
        "PondCount": 21,
        "PondCapacity": 458.92,
        "PondStorage": 414.65,
        "PercentageOfPondStorage": 90.35,
        "previousFileTime": "05/12",
        "previousPondStorage": 415.93,
        "ChineseFileTime": "114/5/21"
    },
    {
        "IANo": null,
        "WorkStationId": "03008",
        "IAName": "桃園",
        "WorkStationName": "新屋",
        "ChannelName": "12支線",
        "fileTime": "06/02",
        "PondCount": 20,
        "PondCapacity": 428.84,
        "PondStorage": 387.45,
        "PercentageOfPondStorage": 90.35,
        "previousFileTime": "05/23",
        "previousPondStorage": 388.95,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03008",
        "IAName": "桃園",
        "WorkStationName": "新屋",
        "ChannelName": "蚵殼港圳",
        "fileTime": "06/02",
        "PondCount": 15,
        "PondCapacity": 295.48,
        "PondStorage": 278.6,
        "PercentageOfPondStorage": 94.29,
        "previousFileTime": "05/23",
        "previousPondStorage": 273.55,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03009",
        "IAName": "桃園",
        "WorkStationName": "湖口",
        "ChannelName": "光復圳",
        "fileTime": "06/02",
        "PondCount": 65,
        "PondCapacity": 909.04,
        "PondStorage": 711.3,
        "PercentageOfPondStorage": 78.25,
        "previousFileTime": "05/20",
        "previousPondStorage": 714.9,
        "ChineseFileTime": "114/6/2"
    },
    {
        "IANo": null,
        "WorkStationId": "03010",
        "IAName": "桃園",
        "WorkStationName": "大溪",
        "ChannelName": "新福等圳",
        "fileTime": "06/02",
        "PondCount": 6,
        "PondCapacity": 105.43,
        "PondStorage": 104.69,
        "PercentageOfPondStorage": 99.3,
        "previousFileTime": "05/22",
        "previousPondStorage": 104.53,
        "ChineseFileTime": "114/6/2"
    }
]
        result2.forEach((item) => {
            item.content = `有效蓄水量`
            totalPondStorage2 += item.PondStorage;
            tatalPoundCapacity2 += item.PondCapacity;
            item.PercentageOfPondStorage = Math.round10(item.PercentageOfPondStorage)
        })
        // 桃園
        totalPondStorage = Math.round10(totalPondStorage, -2)
        tatalPoundCapacity = Math.round10(tatalPoundCapacity, -2)
        TotalPoundStorageRate = Math.round10(((totalPondStorage / tatalPoundCapacity) * 100))
        // 石門
        totalPondStorage2 = Math.round10(totalPondStorage2, -2)
        tatalPoundCapacity2 = Math.round10(tatalPoundCapacity2, -2)
        TotalPoundStorageRate2 = Math.round10(((totalPondStorage2 / tatalPoundCapacity2) * 100))

        let obj = {
            "ChannelName": "埤塘蓄水概況",
            "PondCapacity": 138.77,
            "PondStorage": totalPondStorage,
            "PercentageOfPondStorage": TotalPoundStorageRate,
            content: "總蓄水量"
        }
        let obj2 = {
            "ChannelName": "埤塘蓄水概況",
            "PondCapacity": 138.77,
            "PondStorage": totalPondStorage2,
            "PercentageOfPondStorage": TotalPoundStorageRate2,
            content: "總蓄水量"
        }
        result.unshift(obj)
        result2.unshift(obj2)
        console.log("@result", result)
        console.log("@result2", result2)
        poundInfoList.value = result
        poundInfoList2.value = result2
    } catch (error) {
        console.log(error);
    }
}
// 取得路由
const router = useRouter();

//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();

//目前顯示的資料
const currentData = computed(() => comprehensiveDataStore);

// getDatabaseTablesData()
// 開始模擬
async function clickGetResult() {
    await getResult()
    router.push('/step2');
}
//石門水庫歷史蓄水量
const databaseTablesData = ref(null);
async function getDatabaseTablesData() {
    try {
        let result = await apiGetData('/data/shimen-reservoir-storage-history.json')
        databaseTablesData.value = result.data
    } catch (error) {
        console.log(error);
    }
}
const waterNeedsCalculator = ref(null);
//根據模擬日期=>設定蓄水量
function setSimulationWaterStorage() {
    let date = comprehensiveDataStore.userSettings.step1.decisionMakingDate
    console.log("模擬日期改變了!", date);
    console.log("databaseTablesData", databaseTablesData.value);
    let obj = Enumerable.from(databaseTablesData.value).where(f => dayjs(f.time).format('YYYY-MM-DD') == date).firstOrDefault();
    if (obj != null) {
        //alert(obj.EffectiveStorage);
        comprehensiveDataStore.userSettings.step1.simulationWaterStorage10kTons = Math.round(obj.EffectiveStorage);
    } else {
        comprehensiveDataStore.userSettings.step1.simulationWaterStorage10kTons = 0;
    }
}
async function getResult() {
    comprehensiveDataStore.userSettings.step2.baseDataPath = comprehensiveDataStore.userSettings.step1.baseDataPath
    waterNeedsCalculator.value = new WaterNeedsCalculator();
    await waterNeedsCalculator.value.calculate(comprehensiveDataStore.userSettings.step1);

    comprehensiveDataStore.simulationData.baseData = await waterNeedsCalculator.value.getBaseData();     //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
    comprehensiveDataStore.simulationData.outcomes = await waterNeedsCalculator.value.getOutcomes();
    comprehensiveDataStore.simulationData.reservoirWaterStoarage = await waterNeedsCalculator.value.getReservoirWaterStoarage();
    comprehensiveDataStore.simulationData.areaWaterNeedsByIrrigationGroup = await waterNeedsCalculator.value.getAreaWaterNeedsByIrrigationGroup();

    
}
onMounted(async () => {
    await getDatabaseTablesData()
    getPoundInfoByIrrigation()
})
</script>

<style scoped lang="scss">
.pi {
    cursor: pointer;
}

/* 啟用滾動條 */
.scrollable {
    overflow-x: auto;
}

/* 不允許換行 */
.nowrap {
    flex-wrap: nowrap;
}

.row-container {
    // overflow-x: auto;
    /* 允許水平滾動 */
    // white-space: nowrap;
    /* 確保內容不會自動換行 */
    padding-bottom: 10px;

    /* 避免滾動條遮住內容 */
    .row {
        display: flex;
        // flex-wrap: nowrap;
        /* 不允許換行 */
    }

    .col {
        // flex: 0 0 calc(100% / 4);
        /* 讓每個 col 佔 1/4 寬度 */
        // max-width: calc(100% / 4);
        /* 限制最大寬度 */
        padding: 10px;
        /* 保持間距 */
    }
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
    // max-height: 2vh;
    /* 根據內容高度調整 */
    opacity: 1;
}
</style>
