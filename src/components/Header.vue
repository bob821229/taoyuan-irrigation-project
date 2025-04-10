<template>
    <div class="card">
        <Menubar :model="items">
            <template #start>
                <h4>
                    石門水庫灌溉方案決策模組
                </h4>
            </template>
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
                </a>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <Button icon="pi  pi-cog" @click="visibleRight = true" />
                </div>
            </template>
        </Menubar>
    </div>
    <Drawer style="width: 40vw;" v-model:visible="visibleRight" header="設定摘要" position="right">
        圖表字體大小:
        <div class="flex flex-wrap gap-4 align-items-center">
            <div class="flex items-center gap-2 align-items-center">
                <RadioButton v-model="comprehensiveDataStore.echartsFontSize" inputId="comprehensiveDataStore1" name="pizza" :value="16" />
                <label for="comprehensiveDataStore1" style="font-size: 16px;">小</label>
            </div>
            <div class="flex items-center gap-2 align-items-center">
                <RadioButton v-model="comprehensiveDataStore.echartsFontSize" inputId="comprehensiveDataStore2" name="pizza" :value="20" />
                <label for="comprehensiveDataStore2" style="font-size: 20px;">中</label>
            </div>
            <div class="flex items-center gap-2 align-items-center">
                <RadioButton v-model="comprehensiveDataStore.echartsFontSize" inputId="comprehensiveDataStore3" name="pizza" :value="24" />
                <label for="comprehensiveDataStore3" style="font-size: 24px;">大</label>
            </div>
        </div>
        參數設定:
        <ul>
            <li>
                可供灌水量面積:{{ currentData.baseDataPathTxt }}
            </li>
            <li>
                期作別:{{ currentData.userSettings.step1.farmingPeriod }}
            </li>
            <li>
                模擬時間:{{ currentData.userSettings.step1.decisionMakingDate }}
            </li>
            <li>
                模擬時間蓄水量:{{ currentData.userSettings.step1.simulationWaterStorage10kTons }}
            </li>
            <li>
                民生公共用水量:{{ currentData.userSettings.step1.publicWaterUsage10kTonsPerDay }}
            </li>
            <li>
                安全蓄水量:{{ currentData.userSettings.step1.safeWaterStorage10kTons }}
            </li>
            <li>
                期作總入流量:{{ currentData.userSettings.step1.shimenReservoirInflowPredictionIndex }}
            </li>
        </ul>
        方案選擇:
        <ul>
            <li>
                桃一、石一
            </li>
        </ul>
    </Drawer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Menubar from 'primevue/menubar';
// 取得路由
const router = useRouter();
//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const currentData = computed(() => comprehensiveDataStore);
const items = ref([
    {
        label: '模擬計算參數',
        command: () => {
            router.push('/');
        }
    },
    {
        label: '供灌方案選擇',
        command: () => {
            router.push('/step2');
        }
    },
    {
        label: '整田期錯開計算說明',
        command: () => {
            router.push('/step4');
        }
    },
    // {
    //     label: '埤塘現況',
    //     command: () => {
    //         router.push('/step5');
    //     }
    // },
    {
        label: '大圳配水量',
        command: () => {
            router.push('/step5');
        }
    },
    // {
    //     label: '水源別',
    //     command: () => {
    //         router.push('/step7');
    //     }
    // },
]);
//是否顯示左邊選單
const visibleRight = ref(false);
</script>

<style scoped lang="scss">
.set_btn {
    cursor: pointer;
}
</style>