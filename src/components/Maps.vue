<template>
  <div class="mapShell">
    <div ref="mapContainerRef" class="mapView" :class="{ isHidden: mapStatus === 'idle' || mapStatus === 'error' }"></div>

    <div v-if="mapStatus === 'idle'" class="mapState">
      地圖尚未載入
      <Button class="mt-2" size="small" label="載入互動地圖" @click="loadMap" />
    </div>
    <div v-if="mapStatus === 'loading'" class="mapState">
      地圖載入中...
    </div>
    <div v-if="mapStatus === 'error'" class="mapState mapStateError">
      互動地圖暫時無法載入
      <Button class="mt-2" size="small" label="重新載入地圖" @click="reloadMap" />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, toRaw, watch } from 'vue';
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';

const props = defineProps({
  mapConfigs: {
    type: Object,
    default: () => ({
      showWaterGroup: false,
      showPlantingMound: false,
    }),
  },
});

const MAP_SERVICE_URL = 'https://gisportal.triwra.org.tw/server/rest/services/BigBossTaoyuanPonds/MapServer';
const MAP_VIEW_TIMEOUT_MS = 15000;
const MAP_SERVICE_TIMEOUT_MS = 5000;
const DEFAULT_IRRIGATION_GROUPS = ['桃二', '桃三', '石一', '石二', '桃一'];

const comprehensiveDataStore = useComprehensiveDataStore();
const mapContainerRef = ref(null);
const mapStatus = ref('idle');

const mapProfile = {
  mapView: null,
  mapImageLayer: null,
  subLayers: {},
};

let mapModules = null;
let mapBootId = 0;
let isDisposed = false;

const hasPickedCombination = computed(() => (
  comprehensiveDataStore.solutionUserPicked.irrigationCombination != null
));

const selectedIrrigationGroups = computed(() => {
  const pickedCombination = comprehensiveDataStore.solutionUserPicked.irrigationCombination;

  if (pickedCombination?.groupList?.length) {
    return pickedCombination.groupList
      .map((group) => group['灌區'])
      .filter(Boolean);
  }

  return DEFAULT_IRRIGATION_GROUPS;
});

function runWhenBrowserIsIdle(callback) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 800 });
    return;
  }

  setTimeout(callback, 120);
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId = null;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

async function loadMapModules() {
  if (mapModules != null) {
    return mapModules;
  }

  const [MapModule, MapImageLayerModule, MapViewModule] = await Promise.all([
    import('@arcgis/core/Map'),
    import('@arcgis/core/layers/MapImageLayer.js'),
    import('@arcgis/core/views/MapView'),
  ]);

  mapModules = {
    Map: MapModule.default,
    MapImageLayer: MapImageLayerModule.default,
    MapView: MapViewModule.default,
  };

  return mapModules;
}

async function assertMapServiceAvailable() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MAP_SERVICE_TIMEOUT_MS);

  try {
    const response = await fetch(`${MAP_SERVICE_URL}?f=json`, {
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Map service responded with ${response.status}`);
    }

    const serviceInfo = await response.json();
    if (serviceInfo?.error) {
      throw new Error(serviceInfo.error.message || 'Map service returned an error');
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

function escapeSqlValue(value) {
  return String(value).replaceAll("'", "''");
}

function toSqlInList(list) {
  return list.map((value) => `'${escapeSqlValue(value)}'`).join(',');
}

function buildWorkstationWhere() {
  const associationList = comprehensiveDataStore.userPickedAssociationList ?? [];

  if (associationList.length === 0) {
    return '1 = 1';
  }

  const groupsByAssociation = associationList.reduce((groups, item) => {
    if (!item?.association || !item?.workstation) {
      return groups;
    }

    if (!groups.has(item.association)) {
      groups.set(item.association, []);
    }
    groups.get(item.association).push(item.workstation);
    return groups;
  }, new Map());

  const whereList = [...groupsByAssociation.entries()].map(([association, workstationList]) => (
    `(管理處名稱='${escapeSqlValue(association)}' and 工作站名稱 in (${toSqlInList(workstationList)}))`
  ));

  return whereList.length > 0 ? whereList.join(' or ') : '1 = 1';
}

function buildPlantingFrequencyWhere() {
  const landUsingFrequency = comprehensiveDataStore.baseDataPlantingAreaPathPickedData?.land_using_frequency;

  if (landUsingFrequency == null) {
    return '1 = 2';
  }

  if (landUsingFrequency < 6 && landUsingFrequency > 0) {
    const yearList = [];
    for (let year = landUsingFrequency; year <= 6; year++) {
      yearList.push(`years_6 = ${year}`);
    }
    return `(${yearList.join(' or ')})`;
  }

  return `years_6 = ${landUsingFrequency}`;
}

function buildPlantingMoundScopeWhere() {
  if (hasPickedCombination.value) {
    return `灌區 in (${toSqlInList(selectedIrrigationGroups.value)})`;
  }

  const irrigationGroupList = comprehensiveDataStore.uiSettings.irrigationGroupList ?? [];
  const groupsByAssociation = irrigationGroupList.reduce((groups, item) => {
    if (!item?.association || !item?.workstation) {
      return groups;
    }

    if (!groups.has(item.association)) {
      groups.set(item.association, []);
    }
    groups.get(item.association).push(item.workstation);
    return groups;
  }, new Map());

  const whereList = [...groupsByAssociation.entries()].map(([association, workstationList]) => (
    `(管理處名稱 = '${escapeSqlValue(association)}' and 工作站名稱 in (${toSqlInList(workstationList)}))`
  ));

  return whereList.length > 0
    ? whereList.join(' or ')
    : `灌區 in (${toSqlInList(selectedIrrigationGroups.value)})`;
}

function buildPlantingMoundWhere() {
  return `${buildPlantingFrequencyWhere()} and (${buildPlantingMoundScopeWhere()})`;
}

function buildSublayers() {
  return [
    {
      id: 16,
      visible: true,
      definitionExpression: "分區 <> '非灌區'",
      opacity: 0.72,
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: [50, 160, 120, 0.2],
          outline: {
            color: [36, 120, 92, 0.8],
            width: 1.2,
          },
        },
      },
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: '$feature.分區',
          },
          labelPlacement: 'always-horizontal',
          symbol: {
            type: 'text',
            color: [30, 58, 82, 1],
            haloColor: [255, 255, 255, 0.85],
            haloSize: 1,
            font: {
              size: 12,
              weight: 'bold',
            },
          },
          where: `分區 in (${toSqlInList(selectedIrrigationGroups.value)})`,
        },
      ],
    },
    {
      id: 13,
      visible: props.mapConfigs.showWaterGroup,
      definitionExpression: props.mapConfigs.showWaterGroup ? buildWorkstationWhere() : '1 = 2',
      opacity: 0.78,
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: [58, 132, 255, 0.1],
          outline: {
            color: [45, 105, 210, 0.9],
            width: 1,
          },
        },
      },
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: '$feature.工作站名稱',
          },
          labelPlacement: 'always-horizontal',
          symbol: {
            type: 'text',
            color: [35, 60, 90, 1],
            haloColor: [255, 255, 255, 0.9],
            haloSize: 1,
            font: {
              size: 10,
              weight: 'bold',
            },
          },
          where: props.mapConfigs.showWaterGroup ? buildWorkstationWhere() : '1 = 2',
        },
      ],
    },
    {
      id: 39,
      visible: props.mapConfigs.showPlantingMound && hasPickedCombination.value,
      definitionExpression: props.mapConfigs.showPlantingMound && hasPickedCombination.value
        ? buildPlantingMoundWhere()
        : '1 = 2',
      opacity: 0.64,
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: [244, 180, 64, 0.34],
          outline: {
            color: [210, 132, 34, 0.72],
            width: 0.45,
          },
        },
      },
    },
  ];
}

function syncLayerFilters() {
  const irrigationGroupLayer = toRaw(mapProfile.subLayers.irrigationGroupLayer);
  const workstationLayer = toRaw(mapProfile.subLayers.workstationLayer);
  const plantingMoundLayer = toRaw(mapProfile.subLayers.plantingMoundLayer);

  if (irrigationGroupLayer) {
    irrigationGroupLayer.visible = true;
    irrigationGroupLayer.definitionExpression = "分區 <> '非灌區'";

    const labelStyle = irrigationGroupLayer.labelingInfo?.toArray?.() ?? irrigationGroupLayer.labelingInfo;
    if (labelStyle?.[0]) {
      labelStyle[0].where = `分區 in (${toSqlInList(selectedIrrigationGroups.value)})`;
      irrigationGroupLayer.labelingInfo = labelStyle;
    }
  }

  if (workstationLayer) {
    const workstationWhere = props.mapConfigs.showWaterGroup ? buildWorkstationWhere() : '1 = 2';
    workstationLayer.visible = props.mapConfigs.showWaterGroup;
    workstationLayer.definitionExpression = workstationWhere;

    const labelStyle = workstationLayer.labelingInfo?.toArray?.() ?? workstationLayer.labelingInfo;
    if (labelStyle?.[0]) {
      labelStyle[0].where = workstationWhere;
      workstationLayer.labelingInfo = labelStyle;
    }
  }

  if (plantingMoundLayer) {
    const shouldShowPlantingMound = props.mapConfigs.showPlantingMound && hasPickedCombination.value;
    plantingMoundLayer.visible = shouldShowPlantingMound;
    plantingMoundLayer.definitionExpression = shouldShowPlantingMound
      ? buildPlantingMoundWhere()
      : '1 = 2';
  }
}

async function bootMap(bootId) {
  mapStatus.value = 'loading';
  await assertMapServiceAvailable();

  if (isDisposed || bootId !== mapBootId || mapContainerRef.value == null) {
    return;
  }

  const { Map, MapImageLayer, MapView } = await loadMapModules();

  if (isDisposed || bootId !== mapBootId || mapContainerRef.value == null) {
    return;
  }

  const mapImageLayer = new MapImageLayer({
    url: MAP_SERVICE_URL,
    sublayers: buildSublayers(),
  });
  const map = new Map({
    layers: [mapImageLayer],
  });
  const view = new MapView({
    map,
    container: mapContainerRef.value,
    center: [121.2230158, 24.9536558],
    zoom: 10,
    constraints: {
      rotationEnabled: false,
      snapToZoom: true,
    },
  });

  view.ui.components = [];
  mapProfile.mapView = view;
  mapProfile.mapImageLayer = mapImageLayer;
  mapProfile.subLayers.workstationLayer = mapImageLayer.findSublayerById(13);
  mapProfile.subLayers.irrigationGroupLayer = mapImageLayer.findSublayerById(16);
  mapProfile.subLayers.plantingMoundLayer = mapImageLayer.findSublayerById(39);

  syncLayerFilters();

  await withTimeout(view.when(), MAP_VIEW_TIMEOUT_MS, 'Map view initialization timed out');

  if (isDisposed || bootId !== mapBootId) {
    return;
  }

  mapStatus.value = 'ready';
}

function destroyMap() {
  const view = toRaw(mapProfile.mapView);
  if (view?.destroy) {
    view.destroy();
  }

  mapProfile.mapView = null;
  mapProfile.mapImageLayer = null;
  mapProfile.subLayers = {};
}

function reloadMap() {
  const bootId = ++mapBootId;
  destroyMap();
  mapStatus.value = 'loading';

  nextTick(() => {
    runWhenBrowserIsIdle(() => {
      bootMap(bootId).catch((error) => {
        console.error('ArcGIS MapView init failed:', error);
        if (!isDisposed && bootId === mapBootId) {
          destroyMap();
          mapStatus.value = 'error';
        }
      });
    });
  });
}

function loadMap() {
  reloadMap();
}

onMounted(() => {
  mapStatus.value = 'idle';
});

onUnmounted(() => {
  isDisposed = true;
  mapBootId++;
  destroyMap();
});

watch(
  () => [
    props.mapConfigs.showWaterGroup,
    props.mapConfigs.showPlantingMound,
    comprehensiveDataStore.baseDataPlantingAreaPathPickedData?.land_using_frequency,
    comprehensiveDataStore.solutionUserPicked.irrigationCombination?.title,
    comprehensiveDataStore.userPickedAssociationList?.length,
  ],
  () => {
    syncLayerFilters();
  }
);
</script>

<style scoped lang="scss">
.mapShell {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border: 1px solid #d8e0ea;
  background: #eef6fb;
}

.mapView {
  width: 100%;
  height: 100%;
}

.mapState {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.82);
  color: #334155;
  font-weight: 600;
}

.mapStateError {
  color: #b91c1c;
}
</style>
