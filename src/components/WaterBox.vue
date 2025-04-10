<template>
    <div class="card_wrap">
        <Card style=" box-shadow: 0 5px 8px rgba(0, 0, 0, 0.6);">
            <template #header></template>
            <template #title>
                <div class="title_txt">
                    <span>{{ title }}</span>
                </div>
            </template>
            <!-- <template #subtitle>更新日期：114-03-03</template> -->
            <template #content>
                <div class="row">
                    <div class="col-12">
                        <div class="water-jar-wrap">
                            <ui-water-jar :value="props.value" :color="waterColor"></ui-water-jar>
                            <span class="water-jar-value" >
                                {{ value }}%
                            </span>
                        </div>
                    </div>
                    <div class="col-12 content_txt" :style="{ color: waterColor }">
                        {{ content }}
                    </div>
                    <div class="col-12 content_txt" :style="{ color: waterColor }">
                        {{ waterCount }}/萬噸
                    </div>
                </div>

            </template>
        </Card>
    </div>


</template> :style="{ color: waterColor }"

<script setup>
import { ref, onMounted, computed } from 'vue'
const waterColor = computed(() => {
    if (props.value >= 75) {
        return '#46AFF9'
    } else if (props.value >= 50) {
        return '#FF8F01'
    } else {
        return '#E03015'
    }
})
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 0,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    waterCount: {
        type: Number,
        default: 0
    }
})
</script>

<style scoped lang="scss">
.card_wrap {
    padding: 10px;
}

.water-jar-wrap {
    position: relative;
    width: 60%;
    margin: auto;
}

.title_txt {
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    color: #606060;
}
.content_txt{
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    color: #606060;

}
.water-jar-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    color: #fff;
    z-index: 10;
    text-shadow: 2px 2px 3px #606060;
    // -webkit-text-stroke: 0.6px black;
}
</style>