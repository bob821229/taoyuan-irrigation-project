<template>
    <div class="row">
        <div class="col-6">
            <Card class='mb-2 ' style="">
                <template #header></template>
                <template #title>模擬結果</template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <div class="text-center">
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <label for="inputEmail3"
                                    class="col-auto col-sm-12 col-form-label text-start">可供灌總面積(公頃)：</label>
                                <div class="col-auto col-sm-12 text-start">
                                    <h4>{{
                                        store.minPlantingAreaAvailableToIrrigatedByReservoirWaterData.toLocaleString()
                                    }}
                                    </h4>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <label for="inputEmail3"
                                    class="col-auto col-sm-12 col-form-label text-start">可供灌總配水量(萬噸)：</label>
                                <div class="col-auto col-sm-12 text-start">
                                    <h4>{{ store.availableWaterForAgricultureData.toLocaleString() }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="col-6">
            <Card class='mb-2 ' style="">
                <template #header></template>
                <template #title v-if="store.solutionUserPicked.irrigationCombination">{{
                    store.solutionUserPicked.irrigationCombination.title}}</template>
                <template #title v-else>{{ '未選擇' }}</template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <div class="text-center">
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <label for="inputEmail3"
                                    class="col-auto col-sm-12 col-form-label text-start">供灌面積(公頃)：</label>
                                <div class="col-auto col-sm-12 text-start">
                                    <h4>{{ store.solutionUserPicked.irrigationCombination.totalArea.toLocaleString() }}
                                    </h4>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <label for="inputEmail3"
                                    class="col-auto col-sm-12 col-form-label text-start">供灌需水量(萬噸)：</label>
                                <div class="col-auto col-sm-12 text-start">
                                    <h4>{{
                                        store.solutionUserPicked.irrigationCombination.totalWaterNeeds.toLocaleString()
                                        }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <div class="row">
        <div class="col-6">
            <Card class='mb-2 h-100' style="">
                <template #header></template>
                <template #title>灌區及種植坵塊地圖</template>
                <!--<template #subtitle>Card subtitle</template>-->
                <template #content>
                    <Maps></Maps>
                </template>
            </Card>
        </div>
        <div class="col-6">
            <Card class='mb-2 h-100' style="">
                <template #header></template>
                <template #title>供灌模擬驗證圖</template>
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
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class=" btn_wrap">
                <Button @click="previousStep">上一步</Button>
                <Button @click="nextStep">下一步</Button>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref, watchEffect, onMounted, computed } from 'vue'
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
import Maps from '../components/Maps.vue';
import SimpleEchart from '../components/SimpleEchart.vue';
import Enumerable from 'linq'
import { RouterLink, RouterView, useRouter } from 'vue-router'
// 取得路由
const router = useRouter();
//上一步
const previousStep = () => {
    router.push('/step2');
}
//下一步
const nextStep = () => {
    router.push('/step4');
}
//取得store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
// const currentData = ref(employeeStore.tmpBasicInformation);
const store = computed(() => comprehensiveDataStore);


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
    console.log('optionData:',optionData);
    return optionData;
})
</script>

<style scoped lang="scss">
.btn_wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>