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
                                更新日期：114-03-03
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
                                更新日期：114-03-03
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
                            @wheel="handleWheelScroll">
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
    const container = event.currentTarget;
    if (container.scrollWidth > container.clientWidth) {
        event.preventDefault(); // 阻止預設滾動行為（避免垂直滾動）
        container.scrollLeft += event.deltaY; // 讓滾輪上下滾動轉為左右滾動
    }
};
//取得 埤塘資訊
async function getPoundInfoByIrrigation() {
    try {
        let result = [
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
            },
            {
                "IANo": null,
                "WorkStationId": "04002",
                "IAName": "石門",
                "WorkStationName": "中壢",
                "ChannelName": "平鎮",
                "fileTime": "03/03",
                "PondCount": 2,
                "PondCapacity": 1.51,
                "PondStorage": 0.94,
                "PercentageOfPondStorage": 62.12,
                "previousFileTime": "02/17",
                "previousPondStorage": 0.96,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04002",
                "IAName": "石門",
                "WorkStationName": "中壢",
                "ChannelName": "東勢",
                "fileTime": "03/03",
                "PondCount": 6,
                "PondCapacity": 0.75,
                "PondStorage": 0.49,
                "PercentageOfPondStorage": 65.61,
                "previousFileTime": "02/17",
                "previousPondStorage": 0.5,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04002",
                "IAName": "石門",
                "WorkStationName": "中壢",
                "ChannelName": "社子",
                "fileTime": "03/03",
                "PondCount": 6,
                "PondCapacity": 21.11,
                "PondStorage": 11.89,
                "PercentageOfPondStorage": 56.34,
                "previousFileTime": "02/17",
                "previousPondStorage": 12.18,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04002",
                "IAName": "石門",
                "WorkStationName": "中壢",
                "ChannelName": "南勢",
                "fileTime": "03/03",
                "PondCount": 3,
                "PondCapacity": 1.69,
                "PondStorage": 0.97,
                "PercentageOfPondStorage": 57.14,
                "previousFileTime": "02/17",
                "previousPondStorage": 0.99,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04002",
                "IAName": "石門",
                "WorkStationName": "中壢",
                "ChannelName": "埔頂",
                "fileTime": "03/03",
                "PondCount": 15,
                "PondCapacity": 41.69,
                "PondStorage": 22.25,
                "PercentageOfPondStorage": 53.36,
                "previousFileTime": "02/17",
                "previousPondStorage": 22.9,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04003",
                "IAName": "石門",
                "WorkStationName": "過嶺",
                "ChannelName": "過嶺",
                "fileTime": "03/03",
                "PondCount": 85,
                "PondCapacity": 226.02,
                "PondStorage": 161.74,
                "PercentageOfPondStorage": 71.56,
                "previousFileTime": "02/17",
                "previousPondStorage": 163.8,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04004",
                "IAName": "石門",
                "WorkStationName": "楊梅",
                "ChannelName": "大金山",
                "fileTime": "03/03",
                "PondCount": 4,
                "PondCapacity": 0.91,
                "PondStorage": 0.68,
                "PercentageOfPondStorage": 74.55,
                "previousFileTime": "02/17",
                "previousPondStorage": 0.69,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04004",
                "IAName": "石門",
                "WorkStationName": "楊梅",
                "ChannelName": "山溪",
                "fileTime": "03/03",
                "PondCount": 2,
                "PondCapacity": 4.64,
                "PondStorage": 3.46,
                "PercentageOfPondStorage": 74.57,
                "previousFileTime": "02/17",
                "previousPondStorage": 3.49,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04004",
                "IAName": "石門",
                "WorkStationName": "楊梅",
                "ChannelName": "山麓",
                "fileTime": "03/03",
                "PondCount": 9,
                "PondCapacity": 5.71,
                "PondStorage": 4.26,
                "PercentageOfPondStorage": 74.57,
                "previousFileTime": "02/17",
                "previousPondStorage": 4.3,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04004",
                "IAName": "石門",
                "WorkStationName": "楊梅",
                "ChannelName": "高山頂",
                "fileTime": "03/03",
                "PondCount": 3,
                "PondCapacity": 1.26,
                "PondStorage": 0.94,
                "PercentageOfPondStorage": 74.56,
                "previousFileTime": "02/17",
                "previousPondStorage": 0.95,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04004",
                "IAName": "石門",
                "WorkStationName": "楊梅",
                "ChannelName": "環頂",
                "fileTime": "03/03",
                "PondCount": 59,
                "PondCapacity": 114.41,
                "PondStorage": 85.31,
                "PercentageOfPondStorage": 74.57,
                "previousFileTime": "02/17",
                "previousPondStorage": 86.07,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04005",
                "IAName": "石門",
                "WorkStationName": "富岡",
                "ChannelName": "繞嶺",
                "fileTime": "03/03",
                "PondCount": 79,
                "PondCapacity": 378.81,
                "PondStorage": 245.5,
                "PercentageOfPondStorage": 64.81,
                "previousFileTime": "02/17",
                "previousPondStorage": 249.62,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04006",
                "IAName": "石門",
                "WorkStationName": "湖口",
                "ChannelName": "湖口",
                "fileTime": "03/03",
                "PondCount": 27,
                "PondCapacity": 46.07,
                "PondStorage": 28.94,
                "PercentageOfPondStorage": 62.81,
                "previousFileTime": "02/17",
                "previousPondStorage": 29.44,
                "ChineseFileTime": "114/2/24"
            },
            {
                "IANo": null,
                "WorkStationId": "04006",
                "IAName": "石門",
                "WorkStationName": "湖口",
                "ChannelName": "繞嶺",
                "fileTime": "03/03",
                "PondCount": 8,
                "PondCapacity": 35.67,
                "PondStorage": 22.4,
                "PercentageOfPondStorage": 62.81,
                "previousFileTime": "02/17",
                "previousPondStorage": 22.79,
                "ChineseFileTime": "114/2/24"
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

        let result2 = [
            {
                "IANo": null,
                "WorkStationId": "03001",
                "IAName": "桃園",
                "WorkStationName": "桃園",
                "ChannelName": "1支線",
                "fileTime": "03/03",
                "PondCount": 4,
                "PondCapacity": 72.41,
                "PondStorage": 56.12,
                "PercentageOfPondStorage": 77.51,
                "previousFileTime": "02/20",
                "previousPondStorage": 56.12,
                "ChineseFileTime": "114/3/3"
            },
            {
                "IANo": null,
                "WorkStationId": "03002",
                "IAName": "桃園",
                "WorkStationName": "大竹",
                "ChannelName": "2支線",
                "fileTime": "03/03",
                "PondCount": 28,
                "PondCapacity": 360,
                "PondStorage": 293.4,
                "PercentageOfPondStorage": 81.5,
                "previousFileTime": "02/24",
                "previousPondStorage": 293.4,
                "ChineseFileTime": "114/3/3"
            },
            {
                "IANo": null,
                "WorkStationId": "03003",
                "IAName": "桃園",
                "WorkStationName": "大園",
                "ChannelName": "3支線",
                "fileTime": "03/03",
                "PondCount": 6,
                "PondCapacity": 38.22,
                "PondStorage": 33.78,
                "PercentageOfPondStorage": 88.39,
                "previousFileTime": "02/24",
                "previousPondStorage": 33.78,
                "ChineseFileTime": "114/2/26"
            },
            {
                "IANo": null,
                "WorkStationId": "03003",
                "IAName": "桃園",
                "WorkStationName": "大園",
                "ChannelName": "4支線",
                "fileTime": "03/03",
                "PondCount": 14,
                "PondCapacity": 138.56,
                "PondStorage": 124.16,
                "PercentageOfPondStorage": 89.61,
                "previousFileTime": "02/24",
                "previousPondStorage": 124.16,
                "ChineseFileTime": "114/2/26"
            },
            {
                "IANo": null,
                "WorkStationId": "03003",
                "IAName": "桃園",
                "WorkStationName": "大園",
                "ChannelName": "5支線",
                "fileTime": "03/03",
                "PondCount": 12,
                "PondCapacity": 140.09,
                "PondStorage": 112.09,
                "PercentageOfPondStorage": 80.02,
                "previousFileTime": "02/24",
                "previousPondStorage": 112.09,
                "ChineseFileTime": "114/2/26"
            },
            {
                "IANo": null,
                "WorkStationId": "03004",
                "IAName": "桃園",
                "WorkStationName": "大崙",
                "ChannelName": "6支線",
                "fileTime": "03/03",
                "PondCount": 12,
                "PondCapacity": 126.74,
                "PondStorage": 115.71,
                "PercentageOfPondStorage": 91.3,
                "previousFileTime": "02/03",
                "previousPondStorage": 115.71,
                "ChineseFileTime": "114/2/20"
            },
            {
                "IANo": null,
                "WorkStationId": "03004",
                "IAName": "桃園",
                "WorkStationName": "大崙",
                "ChannelName": "7支線",
                "fileTime": "03/03",
                "PondCount": 11,
                "PondCapacity": 198.95,
                "PondStorage": 170.99,
                "PercentageOfPondStorage": 85.94,
                "previousFileTime": "02/03",
                "previousPondStorage": 170.99,
                "ChineseFileTime": "114/2/20"
            },
            {
                "IANo": null,
                "WorkStationId": "03004",
                "IAName": "桃園",
                "WorkStationName": "大崙",
                "ChannelName": "8-1支線",
                "fileTime": "03/03",
                "PondCount": 5,
                "PondCapacity": 68.2,
                "PondStorage": 61.8,
                "PercentageOfPondStorage": 90.61,
                "previousFileTime": "02/03",
                "previousPondStorage": 61.8,
                "ChineseFileTime": "114/2/20"
            },
            {
                "IANo": null,
                "WorkStationId": "03005",
                "IAName": "桃園",
                "WorkStationName": "草漯",
                "ChannelName": "8支線",
                "fileTime": "03/03",
                "PondCount": 31,
                "PondCapacity": 410.97,
                "PondStorage": 387.03,
                "PercentageOfPondStorage": 94.17,
                "previousFileTime": "01/11",
                "previousPondStorage": 390.59,
                "ChineseFileTime": "114/2/21"
            },
            {
                "IANo": null,
                "WorkStationId": "03006",
                "IAName": "桃園",
                "WorkStationName": "新坡",
                "ChannelName": "10-1號池",
                "fileTime": "03/03",
                "PondCount": 1,
                "PondCapacity": 7.81,
                "PondStorage": 7.22,
                "PercentageOfPondStorage": 92.44,
                "previousFileTime": "02/20",
                "previousPondStorage": 7.22,
                "ChineseFileTime": "114/2/27"
            },
            {
                "IANo": null,
                "WorkStationId": "03006",
                "IAName": "桃園",
                "WorkStationName": "新坡",
                "ChannelName": "8-2號池",
                "fileTime": "03/03",
                "PondCount": 1,
                "PondCapacity": 4.66,
                "PondStorage": 4.07,
                "PercentageOfPondStorage": 87.5,
                "previousFileTime": "02/20",
                "previousPondStorage": 4.07,
                "ChineseFileTime": "114/2/27"
            },
            {
                "IANo": null,
                "WorkStationId": "03006",
                "IAName": "桃園",
                "WorkStationName": "新坡",
                "ChannelName": "9支線",
                "fileTime": "03/03",
                "PondCount": 15,
                "PondCapacity": 273.83,
                "PondStorage": 210.78,
                "PercentageOfPondStorage": 76.98,
                "previousFileTime": "02/20",
                "previousPondStorage": 211.75,
                "ChineseFileTime": "114/2/27"
            },
            {
                "IANo": null,
                "WorkStationId": "03007",
                "IAName": "桃園",
                "WorkStationName": "觀音",
                "ChannelName": "10支線",
                "fileTime": "03/03",
                "PondCount": 15,
                "PondCapacity": 346.94,
                "PondStorage": 305.19,
                "PercentageOfPondStorage": 87.97,
                "previousFileTime": "02/11",
                "previousPondStorage": 288.17,
                "ChineseFileTime": "114/2/21"
            },
            {
                "IANo": null,
                "WorkStationId": "03007",
                "IAName": "桃園",
                "WorkStationName": "觀音",
                "ChannelName": "11支線",
                "fileTime": "03/03",
                "PondCount": 21,
                "PondCapacity": 458.92,
                "PondStorage": 406.11,
                "PercentageOfPondStorage": 88.49,
                "previousFileTime": "02/11",
                "previousPondStorage": 373.7,
                "ChineseFileTime": "114/2/21"
            },
            {
                "IANo": null,
                "WorkStationId": "03008",
                "IAName": "桃園",
                "WorkStationName": "新屋",
                "ChannelName": "12支線",
                "fileTime": "03/03",
                "PondCount": 20,
                "PondCapacity": 428.84,
                "PondStorage": 325.29,
                "PercentageOfPondStorage": 75.85,
                "previousFileTime": "02/24",
                "previousPondStorage": 326.86,
                "ChineseFileTime": "114/3/3"
            },
            {
                "IANo": null,
                "WorkStationId": "03008",
                "IAName": "桃園",
                "WorkStationName": "新屋",
                "ChannelName": "蚵殼港圳",
                "fileTime": "03/03",
                "PondCount": 15,
                "PondCapacity": 295.48,
                "PondStorage": 273.44,
                "PercentageOfPondStorage": 92.54,
                "previousFileTime": "02/24",
                "previousPondStorage": 263.28,
                "ChineseFileTime": "114/3/3"
            },
            {
                "IANo": null,
                "WorkStationId": "03009",
                "IAName": "桃園",
                "WorkStationName": "湖口",
                "ChannelName": "光復圳",
                "fileTime": "03/03",
                "PondCount": 65,
                "PondCapacity": 909.04,
                "PondStorage": 699.97,
                "PercentageOfPondStorage": 77,
                "previousFileTime": "02/20",
                "previousPondStorage": 711.33,
                "ChineseFileTime": "114/3/3"
            },
            {
                "IANo": null,
                "WorkStationId": "03010",
                "IAName": "桃園",
                "WorkStationName": "大溪",
                "ChannelName": "新福等圳",
                "fileTime": "03/03",
                "PondCount": 6,
                "PondCapacity": 105.43,
                "PondStorage": 93.84,
                "PercentageOfPondStorage": 89.01,
                "previousFileTime": "02/10",
                "previousPondStorage": 98.57,
                "ChineseFileTime": "114/2/20"
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
function clickGetResult() {
    getResult()
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
    let obj = Enumerable.from(databaseTablesData.value).where(f => dayjs(f.time).format('MM-DD') == date).firstOrDefault();
    if (obj != null) {
        //alert(obj.EffectiveStorage);
        comprehensiveDataStore.userSettings.step1.simulationWaterStorage10kTons = Math.round(obj.EffectiveStorage);
    } else {
        comprehensiveDataStore.userSettings.step1.simulationWaterStorage10kTons = 0;
    }
}
async function getResult() {
    waterNeedsCalculator.value = new WaterNeedsCalculator();
    await waterNeedsCalculator.value.calculate(comprehensiveDataStore.userSettings.step1);

    comprehensiveDataStore.simulationData.baseData = await waterNeedsCalculator.value.getBaseData();     //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
    comprehensiveDataStore.simulationData.outcomes = await waterNeedsCalculator.value.getOutcomes();
    comprehensiveDataStore.simulationData.reservoirWaterStoarage = await waterNeedsCalculator.value.getReservoirWaterStoarage();
    comprehensiveDataStore.simulationData.areaWaterNeedsByIrrigationGroup = await waterNeedsCalculator.value.getAreaWaterNeedsByIrrigationGroup();

    comprehensiveDataStore.userSettings.step2.baseDataPath = comprehensiveDataStore.userSettings.step1.baseDataPath
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