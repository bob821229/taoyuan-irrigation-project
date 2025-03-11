<template>
    <div class="table-responsive">
        <!--
      {{rowSpanDataMappingsData}}
      {{summaryByIrrigationGroup}}
      {{summaryByIrrigationGroup['桃一']}}
      -->
        <table class="table">
            <thead>
                <tr>
                    <th class="text-center">灌區</th>
                    <th v-for="(fieldObject, idx) in columnMappings" :key="idx" class="text-center">
                        {{ fieldObject.columnTitle }}</th>
                    <th class="text-center">灌區大圳配水量(萬噸)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rIdx) in tableListData" :key="'r' + rIdx">
                    <td v-if="getRowSpanObject(rIdx) != null" :rowspan="getRowSpanObject(rIdx).span"
                        class="text-center align-middle">
                        <h4>{{ row['灌區'] }}</h4>
                    </td>
                    <td v-for="(fieldObject, fIdx) in columnMappings" :key="fieldObject.originalFieldName + fIdx"
                        class="text-end" :class="fieldObject.classList">
                        {{ display(row, fieldObject.originalFieldName, fieldObject.display) }}
                    </td>
                    <td v-if="getRowSpanObject(rIdx) != null" :rowspan="getRowSpanObject(rIdx).span"
                        class="text-center align-middle">
                        <h4>{{ round10(summaryByIrrigationGroup[row['灌區']], 0).toLocaleString() }}</h4>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import Enumerable from "linq";
import { ref, computed, watch, onMounted } from 'vue'
const columnMappings=ref([
        // {
        //   originalFieldName: '灌區',
        //   columnTitle: '灌區',
        // },
        {
          originalFieldName: '站別',
          columnTitle: '站別',
          classList: ['text-center']
        },
        {
          originalFieldName: '灌溉面積(一期作)',
          columnTitle: '灌溉面積(公頃)',
          display: {
            type: 'number',
            // digits: -1
          }
        },
        {
          originalFieldName: '田間需水量',
          columnTitle: '田間需水量(萬噸)',
          display: {
            type: 'number',
            // digits: -1
          }
        },
        {
          originalFieldName: '田間輸水損失率(%)',
          columnTitle: '平均輸水損失率(%)',
          display: {
            type: 'number',
            // digits: -1
          }
        },
        {
          originalFieldName: '大圳配水量',
          columnTitle: '大圳配水量(萬噸)',
          display: {
            type: 'number',
            // digits: -1
          }
        },

      ])
const rowSpanDataMappings=ref([
        {
          rowIdx: 0,
          span: 4,
          field: '桃一'
        },
        {
          rowIdx: 4,
          span: 3,
          field: '桃二'
        },
        {
          rowIdx: 7,
          span: 2,
          field: '桃三'
        },
        {
          rowIdx: 9,
          span: 3,
          field: '石一'
        },
        {
          rowIdx: 12,
          span: 3,
          field: '石二'
        },
      ])
      const props = defineProps({
    tableList: {
        type: Object,
        default: null,
    }
}
)
function getRowSpanObject(rowIndex) {
    let found = rowSpanDataMappingsData.value.
    filter((f) => f.rowIdx == rowIndex);
    if (found.length == 0) {
        return null;
    } else if (found.length == 1) {
        return found[0]
    } else {
        console.error(`found more than 1 match from rowSpanDataMappings with value: ${rowIndex}, length: ${found.length}`);
        return null;
    }
}
function display(row, fieldName, columnDisplayObject) {
    let data = row[fieldName];
    if (columnDisplayObject == null) {
        return data;
    } else if (columnDisplayObject.type == "number") {
        if (columnDisplayObject.digits == null || columnDisplayObject.digits == 0) {
            return Math.round(data).toLocaleString('en-US');
        } else {
            let digits = (columnDisplayObject.digits == null) ? 0 : columnDisplayObject.digits;
            return round10(data, digits).toLocaleString('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            });
        }

    } else {
        return data;
    }
}
function round10(number, digits) {
    let _fixedDigits = -(digits);
    return Math.round10(number, digits);
}
const rowSpanDataMappingsData = computed(() => {
    let groupField = '灌區';
    let caculateField = '大圳配水量';
    let l = Enumerable.from(tableListData.value)
        .groupBy(f => f['灌區'])
        .select(
            g => {
                let obj = {
                    '灌區': g.key(),
                    cnt: g.count()
                }
                return obj;
            }
        ).toArray();

    let start = 0;
    let list = [];
    l.forEach(item => {
        list.push(
            {
                rowIdx: start,
                span: item.cnt,
                field: item['灌區']
            }
        )
        start += item.cnt;
    });

    return list;
})
const summaryByIrrigationGroup = computed(() => {
    let newList = Enumerable.from(tableListData.value)
        .groupBy(f =>
            //`${f['灌區']}||${f['站別']}`
            f['灌區']
        )
        .select(
            g => {
                let obj = {
                    '灌區': g.key(),
                    // '灌區': g.key().split('||')[0],
                    // '站別': g.key().split('||')[1],
                    value: g.sum(f => f['大圳配水量'])
                }
                return obj;
            }
        ).toArray();
    let obj = {};
    newList.forEach(row => {
        obj[row['灌區']] = row.value;
    });
    return obj;
})
const tableFieldListData = computed(() => {
    let list = [];
    if (props.tableList != null) {
        let obj = props.tableList[0];
        list = Object.keys(obj);
    }
    return list;
})
const tableListData = computed(() => {
    return props.tableList;
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
    border: 1px solid #dddddd;
    
}

tr {
    border-bottom: 1px solid #dddddd;
}

tr:last-of-type {
    border-bottom: 1px solid #009879;
}


</style>