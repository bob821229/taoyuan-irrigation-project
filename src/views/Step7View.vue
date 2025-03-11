<template>
    我是第七步驟
    <!-- <div class="row pt-2">
        <div class="col-md-12">
            <div class="card">

                <div class="card-body">
                    <h5 class="card-title d-flex">
                        模擬計算參數
                    </h5>

                    <p class="m-0">
                    <div class="row">
                        <div class="col-md-12">
                            <Card class="mb-2">
                                <template #subtitle>水源</template>
                                <template #content>
                                    <p class="m-0">
                                        水庫(大圳)
                                    </p>
                                </template>
                            </Card>
                        </div>
                        <div class="col-md-9 col-ms-12">
                            <Card style="">
                                <template #subtitle>參數設定</template>
                                <template #content>
                                    <p class="m-0">
                                    <div class="row">
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group">
                                                <div class="input-group">
                                                    <span class="input-group-text" id="basic-addon1">可供灌水量面積</span>
                                                    <select class="form-select"
                                                        v-model="userSettings.step1.baseDataPath">
                                                        <option :value="obj.value"
                                                            v-for="(obj, idx) in uiSettings.baseDataPlantingAreaPathList">
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
                                                    v-for="(obj, idx) in farmingPeriodList" :key="idx">
                                                    <input class="form-check-input" type="radio"
                                                        :id="'cbkFarmingPeriod' + idx" name="cbkFarmingPeriod"
                                                        :value="obj.value" v-model="userSettings.step1.farmingPeriod">
                                                    <label class="form-check-label"
                                                        :for="'cbkFarmingPeriod' + idx">{{ obj.text }}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">模擬時間：</span>
                                                <select class="form-select"
                                                    v-model="userSettings.step1.decisionMakingDate">
                                                    <option v-for="obj in decisionMakingDateList" :value="obj.value"
                                                        :key="obj.value">{{ obj.text }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">模擬時間蓄水量：</span>
                                                <input type="number" class="form-control text-end"
                                                    v-model="userSettings.step1.simulationWaterStorage10kTons">
                                                <span class="input-group-text" id="basic-addon1">萬噸</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">民生公共用水量：</span>
                                                <input type="number" class="form-control text-end"
                                                    v-model="userSettings.step1.publicWaterUsage10kTonsPerDay">
                                                <span class="input-group-text" id="basic-addon1">萬噸/日</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">安全蓄水量：</span>
                                                <input type="number" class="form-control text-end"
                                                    v-model="userSettings.step1.safeWaterStorage10kTons">
                                                <span class="input-group-text" id="basic-addon1">萬噸</span>
                                            </div>
                                        </div>

                                    </div>
                                    模擬時間：{{ userSettings.step1.decisionMakingDate }}，該時間的水庫的蓄水量：{{ userSettings.step1.simulationWaterStorage10kTons
                                        == null ? 0 : userSettings.step1.simulationWaterStorage10kTons.toLocaleString()}}萬噸
                                    </p>
                                </template>
                            </Card>
                        </div>
                        <div class="col-md-3 col-ms-12">
                            <Card class="mb-2">
                                <template #subtitle>超越機率入流量</template>
                                <template #content>
                                    <p class="m-0">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1">期作總入流量：</span>
                                        <select class="form-select"
                                            v-model="userSettings.step1.shimenReservoirInflowPredictionIndex">
                                            <option :value="obj.text" v-for="(obj, idx) in inflowsIndexList" :key="idx">
                                                {{ obj.text }}</option>
                                        </select>
                                    </div>
                                    <div class="input-group mb-3" v-if="false">
                                        <span class="input-group-text" id="basic-addon1">各旬入流量：</span>
                                        <select class="form-select"
                                            v-model="userSettings.step1.shimenReservoirInflowPredictionIndex">
                                            <option :value="obj.text" v-for="(obj, idx) in inflowsIndexList" :key="idx">
                                                {{ obj.text }}</option>
                                        </select>
                                    </div>
                                    </p>
                                </template>
                            </Card>

                        </div>
                    </div>
                    </p>
                </div>


                <div class="card-footer text-body-secondary text-end">
                    <a class="btn btn-primary" @click="clickGetResult">確定模擬</a>
                </div>

            </div>
        </div>
    </div> -->
</template>

<script setup>

</script>

<style scoped lang="scss"></style>