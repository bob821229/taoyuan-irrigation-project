<template>
    <!-- 我是結果頁面 -->
    <div class="page_1-2">
        <div class="row">
            <div class="col-md-6">
                <CounterCard :titleTxt="`可供灌總面積(公頃)`"
                    :number="store.minPlantingAreaAvailableToIrrigatedByReservoirWaterData"></CounterCard>
                <Card class='echart-wrap mb-2' style="">
                    <template #header></template>
                    <template #title>各旬可供灌面積</template>
                    <template #subtitle></template>
                    <template #content>
                        <SimpleEchart :chart-width="'100%'" :chart-height="'53vh'"
                            :chart-x-axis="store.plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData.chartXAxis"
                            :chart-y-axis="store.plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData.chartYAxis"
                            :chart-series="store.plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData.chartSeries">
                        </SimpleEchart>
                    </template>
                </Card>
            </div>
            <div class="col-md-6">
                <CounterCard :titleTxt="`可供灌總配水量(萬噸)`" :number="store.availableWaterForAgricultureData"></CounterCard>

                <Card class='echart-wrap mb-2' style="">
                    <template #header></template>
                    <template #title>石門水庫灌區平均單位面積配水量</template>
                    <template #subtitle></template>
                    <template #content>
                        <SimpleEchart :chart-width="'100%'" :chart-height="'53vh'"
                            :chart-x-axis="store.reservoirWaterUnitAssignmentsByTendaysChartData.chartXAxis"
                            :chart-y-axis="store.reservoirWaterUnitAssignmentsByTendaysChartData.chartYAxis"
                            :chart-series="store.reservoirWaterUnitAssignmentsByTendaysChartData.chartSeries">
                        </SimpleEchart>
                    </template>
                </Card>
            </div>
            <div class="col-12 btn_wrap">
                <Button @click="previousStep">上一步</Button>
                <Button @click="nextStep">下一步</Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
import CounterCard from '../components/CounterCard.vue';
import SimpleEchart from '../components/SimpleEchart.vue';
import { RouterLink, RouterView, useRouter } from 'vue-router'
// 取得路由
const router = useRouter();
//取得store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
// const currentData = ref(employeeStore.tmpBasicInformation);
const store = computed(() => comprehensiveDataStore);
//上一步
const previousStep = () => {
    router.push('/');
}
//下一步
const nextStep = () => {
    router.push('/step2');
}
</script>

<style scoped lang="scss">
.page_1-2 {
    // padding: 10px;
    // border: 1.5px solid rgba(0, 0, 0, 0.175);
    // border-radius: 5px;
    // margin: 10px 0;
    // background-color: #a4b6af;
}

.btn_wrap {
    display: flex;
    justify-content: space-between;
    // margin-top: 10px;
}
</style>