<template>
    <!-- <div class="card h-100">
          <div class="card-body">
            <h5></h5>
            <p class="text-center">
                <h1 id="minPlantingAreaAvailableToIrrigatedByReservoirWater">
                    
                </h1>
            </p>
          </div>
        </div> -->
    <Card class='mb-2' style="">
        <template #header></template>
        <template #title>{{ titleTxt }}</template>
        <!--<template #subtitle>Card subtitle</template>-->
        <template #content>
            <div class="text-center"  >
                <div :class="txtClass">
                    <h2  id="minPlantingAreaAvailableToIrrigatedByReservoirWater" v-if="isNumber">
                        <count-up :startVal='0' :endVal='number' :duration="2"></count-up>
                    </h2>
                    <h2  id="minPlantingAreaAvailableToIrrigatedByReservoirWater" v-if="!isNumber">
                        {{ number }}
                    </h2>
                </div>
            </div>
        </template>

        <template #footer>
            <div style="display: flex; justify-content: center;">
                <slot name="icon">
                </slot>
            </div>
        </template>
    </Card>
</template>

<script setup>
import CountUp from 'vue-countup-v3'
import { computed, ref } from 'vue'
const props = defineProps({
    titleTxt: {
        type: String,
        required: false,
        default: null,
    },
    number: {
        type: Number || String,
        required: true,
        default: 55555,
    },
    txtClass: {
        type: String,
        required: false,
        default: null,
    },
})

const isNumber = computed(() => {
    let t = typeof props.number
    if (t === 'number') {
        return true
    } else {
        return false
    }

})
</script>

<style scoped lang="scss">

</style>