<template>
    <div class="echart" :style="chartStyleData" :id="chartId"></div>
    <!-- {{ data }} -->
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, watchEffect, onMounted, computed, watch, toRaw } from 'vue';
import * as echarts from 'echarts';
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);
// 圖表id
const chartId = ref(uuidv4());
// 初始化echarts 不要使用ref 與eChart的tooltip相容性 有bug
let chartInstance = null;

const props = defineProps({
    //卡片大標題
    titleTxt: {
        type: String,
        default: null,
    },
    //是否自動繪製
    autoDraw: {
        type: Boolean,
        default: false,
    },
    //寬度
    chartWidth: {
        type: String,
        default: "100%"
    },
    //高度
    chartHeight: {
        type: String,
        default: "500px"
    },
    //提示框
    tooltip: {
        type: Object,
        default: {
            trigger: 'axis',
            axisPointer: {
                type: 'line', // Ensure the axis pointer type is 'line'
            }
        },
    },
    //x軸
    chartXAxis: {
        type: Object,
        default: null,
    },
    //y軸
    chartYAxis: {
        type: Object,
        default: null,
    },
    //圖表資料
    chartSeries: {
        type: Object,
        default: null,
    },
    //圖表標題
    chartTitle: {
        type: Object,
        default: null,
    },
    //點擊觸發function
    onClickCallback: {
        type: Function,
        default: (params) => {
            console.log(`default echart onclick callback`);
            console.log(params);
            // if (params.seriesType === 'scatter') {
            //   alert(`You clicked on point: (${params.value[0]}, ${params.value[1]})`);
            // }
        }
    }
})
//用來確認圖表是否需要重劃
const data = computed(() => {
    return props.chartSeries;
})
// 資料有變化就重劃
watch(data, () => {
    console.log('chartSeries changed');
    updateChart();
}, { deep: true })
//初始化或更新圖表
function updateChart() {
    if (!chartInstance) {
        chartInstance = echarts.init(document.getElementById(chartId.value));

        window.addEventListener('resize', () => {
            chartInstance.resize();
        }, false);
    }
    let legendList = [];
    if (props.chartSeries != null) {
        console.log('chartSeries', props.chartSeries);
        legendList = props.chartSeries.map(f => f.name);
    }
    let options = {
        textStyle: {
            fontSize: store.value.echartsFontSize
        },
        title: {
            text: props.chartTitle,
            // subtext: "Sub Title",
            left: "center",
            // top: "center",
            textStyle: {
                fontSize: 16
            },
            // subtextStyle: {
            //     fontSize: 20
            // }
        },
        tooltip: props.tooltip,

        legend: {
            data: legendList,
            itemHeight: 0,
        },
        xAxis: fomatXAxis(props.chartXAxis),
        yAxis: props.chartYAxis,
        series: props.chartSeries
    }
    console.log('@@options:', options);
    chartInstance.setOption(options);
    chartInstance.on('click',
        props.onClickCallback

    );
}
const fomatXAxis = (xAxis) => {
if (!xAxis || !Array.isArray(xAxis.data)) {
        console.warn('fomatXAxis 接收到的 xAxis 無效', xAxis);
        return xAxis; // 或 return {}; 根據你需求
    }

    const map = new Map([
        ['1月上旬', '1上'], ['1月中旬', '1中'], ['1月下旬', '1下'],
        ['2月上旬', '2上'], ['2月中旬', '2中'], ['2月下旬', '2下'],
        ['3月上旬', '3上'], ['3月中旬', '3中'], ['3月下旬', '3下'],
        ['4月上旬', '4上'], ['4月中旬', '4中'], ['4月下旬', '4下'],
        ['5月上旬', '5上'], ['5月中旬', '5中'], ['5月下旬', '5下'],
        ['6月上旬', '6上'], ['6月中旬', '6中'], ['6月下旬', '6下'],
        ['7月上旬', '7上'], ['7月中旬', '7中'], ['7月下旬', '7下'],
        ['8月上旬', '8上'], ['8月中旬', '8中'], ['8月下旬', '8下'],
        ['9月上旬', '9上'], ['9月中旬', '9中'], ['9月下旬', '9下'],
        ['10月上旬', '10上'], ['10月中旬', '10中'], ['10月下旬', '10下'],
        ['11月上旬', '11上'], ['11月中旬', '11中'], ['11月下旬', '11下'],
        ['12月上旬', '12上'], ['12月中旬', '12中'], ['12月下旬', '12下']
    ]);

    xAxis.data = xAxis.data.map(item => map.get(item) || item);

    return xAxis;
}
const chartStyleData = computed(() => {
    if (props.chartWidth == null || props.chartHeight == null) {
        return null;
    } else {
        return {
            width: `${props.chartWidth}`,
            height: `${props.chartHeight}`,
        }
    }
})

onMounted(() => {
    updateChart();
});
</script>

<style scoped lang="scss">
.echart {
    width: 100%;
    height: 600px;
}
</style>