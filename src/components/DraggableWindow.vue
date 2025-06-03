<!-- src/components/DraggableWindow.vue -->
<template>
  <div class="parent" v-if="false">
    <button @click="showDraggable = !showDraggable">開關</button>
    <Vue3DraggableResizable v-if="showDraggable" :initW="400" :initH="minHeight" v-model:x="x" v-model:y="y"
      v-model:w="w" v-model:h="h" :minW="400" v-model:active="active" :draggable="true" :resizable="true"
      :disabledH="true" :parentLimitation="true" @activated="print('activated')" @deactivated="print('deactivated')"
      @drag-start="print('drag-start')" @resize-start="print('resize-start')" @dragging="print('dragging')"
      @resizing="print('resizing')" @drag-end="print('drag-end')" @resize-end="print('resize-end')">
      <div class="dragable-header text-end p-1">
        <button @click="showDraggable = !showDraggable">開關</button>
      </div>
      <div class="dragable-content p-1" ref="content">
        <!-- <h1>Drag me!</h1>
          <p>Width: {{ w }}</p>
          <p>Height: {{ h }}</p>
          <p>X: {{ x }}</p>
          <p>Y: {{ y }}</p> -->
        <h2>
          基本資訊
        </h2>
        名稱:一支線
        長度:1013m
        流量:0.78cms

        <h2>
          埤塘資訊
        </h2>
        口數:3口
        設計庫容:768wt
        實際庫容:278wt

        <h2>
          作物資訊
        </h2>
        最近水稻判釋:2134ha
        近5年土地覆蓋水稻2078ha
        直灌區:178ha

        <h2>
          用水資訊
        </h2>
        近五年計畫平均:368wt
        近五年實際平均:217wt
      </div>
      <div class="dragable-footer">
        <!-- footer -->
      </div>
    </Vue3DraggableResizable>
  </div>
  <!-- <hr>
  <Button label="Show" @click="localVisible = true" />
  <br>
  local:{{localVisible}}
<br>
props:{{props.visible}} -->
  <Dialog v-model:visible="localVisible" :dismissableMask="true" modal header="詳細資料" :style="{ width: '30rem' }"
    @hide="closeDialog">
    <Tabs value="0">
      <TabList>
        <Tab value="0">基本資訊</Tab>
        <Tab value="1">埤塘資訊</Tab>
        <Tab value="2">作物資訊</Tab>
        <Tab value="3">用水資訊</Tab>
      </TabList>
      <TabPanels>
        <!-- TODO:基本資訊 -->
        <TabPanel value="0">
          <p>
            名稱： 
            <span class="fs-5 font-bold">
              {{ irrigationData.basicInfo.name}}
            </span>
          </p>
          <p>
            長度： 
            <span class="fs-5 font-bold">
              {{ irrigationData.basicInfo.length.toLocaleString() }}
            </span>
            m
          </p>
          <p>
            流量： 
            <span class="fs-5 font-bold">
              {{ irrigationData.basicInfo.flowRate.toLocaleString() }} 
            </span>
             cms
          </p>
        </TabPanel>
        <!-- TODO：埤塘資訊 -->
        <TabPanel value="1">
          <p>
            口數： 
            <span class="fs-5 font-bold">
              {{ irrigationData.pondInfo.count }} 
            </span>
             口
          </p>
          <p>
            設計庫容：
            <span class="fs-5 font-bold">
              {{ irrigationData.pondInfo.designCapacity.toLocaleString() }} 
            </span>
             wt
          </p>
          <p>
            實際庫容： 
            <span class="fs-5 font-bold">
              {{ irrigationData.pondInfo.actualCapacity.toLocaleString() }} 
            </span>
             wt
          </p>
        </TabPanel>
        <!-- TODO：作物資訊 -->
        <TabPanel value="2">
          <p>
            最近水稻判釋： 
            <span class="fs-5 font-bold">
              {{ irrigationData.cropInfo.recentRiceArea.toLocaleString() }} 
            </span>
            ha
          </p>
          <p>
            近5年土地覆蓋水稻： 
            <span class="fs-5 font-bold">
              {{ irrigationData.cropInfo.fiveYearAverageRiceArea.toLocaleString() }} 
            </span>
            ha
          </p>
          <p class="text-danger">
            直灌區：
            <span class="fs-5 font-bold ">
              {{ irrigationData.cropInfo.directIrrigationArea.toLocaleString() }} 
            </span>
             ha
          </p>
        </TabPanel>
        <!-- TODO：用水資訊 -->
        <TabPanel value="3">
          <p>
            近五年計畫平均： 
            <span class="fs-5 font-bold">
              {{ irrigationData.waterUsageInfo.fiveYearPlannedAverage.toLocaleString() }} 
            </span>
            wt
          </p>
          <p>
            近五年實際平均： 
            <span class="fs-5 font-bold">
              {{ irrigationData.waterUsageInfo.fiveYearActualAverage.toLocaleString() }} 
            </span>
            wt
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <div v-if="false">
      <p class="mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p class="mb-8">
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
          ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
          adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
          ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
      </p>
      <p class="mb-8">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
          qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae
          non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
      </p>
      <p class="mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p class="mb-8">
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
          ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
          adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
          ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
      </p>
      <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
          qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae
          non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
      </p>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import Dialog from 'primevue/dialog';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  irrigationData: {
    type: Object,
    default: () => ({
      basicInfo: {
        name: "無資料",
        length: null,
        flowRate: null
      },
      pondInfo: {
        count: 0,
        designCapacity: null,
        actualCapacity: null
      },
      cropInfo: {
        recentRiceArea: null,
        fiveYearAverageRiceArea: null,
        directIrrigationArea: null
      },
      waterUsageInfo: {
        fiveYearPlannedAverage: null,
        fiveYearActualAverage: null
      }
    })
  }
})
const localVisible = ref(props.visible);// 用來控制 Dialog 的顯示與隱藏
const emit = defineEmits(['update:visible']); // 定義事件
// 關閉對話框時觸發事件通知父層
const closeDialog = () => {
  localVisible.value = false;
  emit('update:visible', false);
};
// 監聽內容變化
watch(() => props.visible, (newVal) => {
  // console.log('visible changed:', newVal);
  localVisible.value = newVal;
});
// =======================以下為測試=======================
// 定義狀態
// const x = ref(100)
// const y = ref(100)
// const w = ref(100)
// const h = ref(null)
// const active = ref(false)
// const showDraggable = ref(false)
// const minHeight = ref(0) // 動態計算的最小高度
// const content = ref(null)


// // 計算內容高度並設為 minH
// const updateMinHeight = () => {
//   if (content.value) {
//     const height = content.value.offsetHeight + 38 // 加上 dragable-header 的高度
//     minHeight.value = height
//     h.value = height // 初始高度也設為內容高度
//   }
// }
// // 定義方法
// const print = (val) => {
//   console.log(val)
// }
// ======================================



</script>

<style scoped>
/* 可依照需求客製 */
.parent {
  background-color: #fff;
  padding: 10px;
  height: 100%;
}

.dragable-header {
  background-color: #009879;
}

.dragable-content {
  background-color: #fff;
}

.dragable-footer {
  background-color: #c2c0c0;
}

</style>