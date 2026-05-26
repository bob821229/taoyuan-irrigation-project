<template>
  <div class="mapShell">
    <div v-if="mapStatus === 'idle'" class="mapState">
      地圖尚未載入
      <Button class="mt-2" size="small" label="載入地圖" @click="loadMap" />
    </div>
    <div v-if="mapStatus === 'loading'" class="mapState">
      地圖載入中...
    </div>
    <div v-if="mapStatus === 'error'" class="mapState mapStateError">
      地圖服務暫時無法載入，請稍後再試。
      <Button class="mt-2" size="small" label="重新載入地圖" @click="reloadMap" />
    </div>
    <div class="mapView" :id="mapId" :class="{ isHidden: mapStatus !== 'ready' }">
    </div>
  </div>
  <!-- {{ store.baseDataPlantingAreaPathPickedData }} -->
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, onMounted, computed, watch, toRaw, onUnmounted, nextTick } from 'vue';
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
import { MapConfigs } from '@/utils/esri-map/map-configs';
import Enumerable from "linq";
const props = defineProps({
  mapConfigs: {
    type: Object,
    default: () => ({
      showWaterGroup: false,
      showPlantingMound: false,
    }),
  },
})
//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);

const mapId = ref(uuidv4());
const mapStatus = ref('idle');
const mapConfigs = ref(null);
const mapProfile = ref({
  mapView: {},
  mapImageLayer: null,
  subLayers: {},
})

const MAP_SERVICE_URL = "https://gisportal.triwra.org.tw/server/rest/services/BigBossTaoyuanPonds/MapServer";
const MAP_SERVICE_TIMEOUT_MS = 5000;
const MAP_VIEW_TIMEOUT_MS = 9000;

let mapModules = null;
let isDisposed = false;
let mapBootId = 0;

function runWhenBrowserIsIdle(callback) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 800 });
    return;
  }
  setTimeout(callback, 120);
}

async function loadMapModules() {
  if (mapModules) {
    return mapModules;
  }

  const [MapModule, MapImageLayerModule, MapViewModule, GraphicsLayerModule] = await Promise.all([
    import("@arcgis/core/Map"),
    import("@arcgis/core/layers/MapImageLayer.js"),
    import("@arcgis/core/views/MapView"),
    import("@arcgis/core/layers/GraphicsLayer.js"),
  ]);

  mapModules = {
    Map: MapModule.default,
    MapImageLayer: MapImageLayerModule.default,
    MapView: MapViewModule.default,
    GraphicsLayer: GraphicsLayerModule.default,
  };
  return mapModules;
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

async function init(bootId) {
  mapStatus.value = 'loading';
  await assertMapServiceAvailable();
  if (isDisposed || bootId !== mapBootId) {
    return;
  }

  const { Map, MapImageLayer, MapView, GraphicsLayer } = await loadMapModules();
  if (isDisposed || bootId !== mapBootId) {
    return;
  }

  mapConfigs.value = new MapConfigs(
    {
      sublayerVisibilities: {
        '16': { visible: true },
        '25': { visible: false },
        '11': { visible: false },
        '39': { visible: false },
        '13': { visible: props.mapConfigs.showWaterGroup },
        // '10': { visible: props.mapConfigs.showWaterGroup },
      }
    }
  );
  const sublayers = mapConfigs.value
    .getSublayers()
    .filter((sublayer) => [13, 16, 39].includes(sublayer.id));
  let mapImagelayer = new MapImageLayer({
    //gis Map Image Layer
    url: MAP_SERVICE_URL,
    sublayers
  });
  // console.log('mapImagelayer:', mapImagelayer);
  let highlightGraphicsLayer = new GraphicsLayer();
  let territoryGraphicsLayer = new GraphicsLayer();
  let map = new Map({
    //basemap: "topo-vector", // You can choose other basemaps as well
    //basemap: customBasemap,
    layers: [
      //tileLayer,  //最下層
      //webLayer,
      mapImagelayer,  //次下層
      territoryGraphicsLayer,
      highlightGraphicsLayer,
    ]
  });
  // console.log('map:', map);
  // console.log('mapId.value:', mapId.value);
  let view = new MapView({
    map: map,
    // map: webmap,
    center: [121.2230158, 24.9536558], // Longitude, latitude
    zoom: 10, // Zoom level
    container: mapId.value,  // Div element
    constraints: {
      // minZoom: 13, // Prevent zooming out
      // maxZoom: 13, // Prevent zooming in
      rotationEnabled: false, // Disable map rotation
      snapToZoom: true // Snap to fixed zoom levels
    }
  });
  // view.on("drag", function (event) {
  //     event.stopPropagation(); // Prevents panning
  // });

  // view.on("mouse-wheel", function (event) {
  //     event.stopPropagation(); // Prevents zooming with the mouse wheel
  // });

  // view.on("double-click", function (event) {
  //     event.stopPropagation(); // Prevents zooming by double-clicking
  // });

  // view.on("key-down", function (event) {
  //     const prohibitedKeys = ["+", "-", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  //     if (prohibitedKeys.includes(event.key)) {
  //         event.stopPropagation(); // Prevents zooming/panning with the keyboard
  //     }
  // });

  view.ui.components = [];
  mapProfile.value.mapView = view;
  mapProfile.value.mapImageLayer = mapImagelayer;
  // this.mapProfile.subLayers.associationLayer = mapImagelayer.findSublayerById(15);
  mapProfile.value.subLayers.workstationLayer = mapImagelayer.findSublayerById(13);
  mapProfile.value.subLayers.groupLayer = mapImagelayer.findSublayerById(10);//水利小組
  // this.mapProfile.subLayers.pondLayer = mapImagelayer.findSublayerById(14);
  // this.mapProfile.subLayers.mainRiverLayer = mapImagelayer.findSublayerById(11);
  // this.mapProfile.subLayers.taoyuanMainCannalLayer = mapImagelayer.findSublayerById(26);
  // this.mapProfile.subLayers.shimenMainCannalLayer = mapImagelayer.findSublayerById(28);
  // this.mapProfile.subLayers.subCannalLayer = mapImagelayer.findSublayerById(27);
  // this.mapProfile.subLayers.allRiverLayer = mapImagelayer.findSublayerById(12);
  mapProfile.value.subLayers.irrigationGroupLayer = mapImagelayer.findSublayerById(16);//灌區
  // this.mapProfile.subLayers.reservoirLayer = mapImagelayer.findSublayerById(25);
  // this.mapProfile.subLayers.highlightGraphicsLayer = highlightGraphicsLayer;
  // this.mapProfile.subLayers.territoryGraphicsLayer = territoryGraphicsLayer;
  mapProfile.value.subLayers.farmingDensity = mapImagelayer.findSublayerById(39);//坵塊

  await withTimeout(view.when(() => {
    if (isDisposed || bootId !== mapBootId) {
      return;
    }

    view.on('click', (a, b, c) => {
      // console.log('view click', a, b, c);
    });

    view.watch("scale", function (newScale) {
      // console.log("Updated scale: ", newScale);
    });

    updateMapLayers();
    mapStatus.value = 'ready';

  }), MAP_VIEW_TIMEOUT_MS, 'Map view initialization timed out');
}
async function bootMap() {
  const bootId = ++mapBootId;
  try {
    await init(bootId);
  } catch (error) {
    console.error('ArcGIS map init failed:', error);
    if (bootId === mapBootId && !isDisposed) {
      mapBootId++;
      destroyMap();
      mapStatus.value = 'error';
    }
  }
}
function reloadMap() {
  mapBootId++;
  destroyMap();
  mapId.value = uuidv4();
  nextTick(() => runWhenBrowserIsIdle(() => {
    if (!isDisposed) {
      bootMap();
    }
  }));
}
function loadMap() {
  reloadMap();
}
function updateMapLayers() {
  if (!mapConfigs.value || !mapProfile.value.mapView) {
    return;
  }

  const farmingDensity = toRaw(mapProfile.value.subLayers.farmingDensity);
  const workstationLayer = toRaw(mapProfile.value.subLayers.workstationLayer);
  const hasPickedCombination = store.value.solutionUserPicked.irrigationCombination != null;
  const shouldShowPlantingMound = props.mapConfigs.showPlantingMound && hasPickedCombination;

  if (farmingDensity) {
    farmingDensity.visible = shouldShowPlantingMound;
  }
  if (workstationLayer) {
    workstationLayer.visible = props.mapConfigs.showWaterGroup;
  }

  if (shouldShowPlantingMound) {
    toggleMapFarmingFrequency();
  } else if (farmingDensity) {
    farmingDensity.definitionExpression = "1 = 2";
  }
  toggleMapIrrigationGroup();
  toggleMapWorkstation();
}
// 根據使用者選擇的方案 篩選出對灌區的大標題
function toggleMapIrrigationGroup() {
  //   console.log('##toggleMapIrrigationGroup');
  //console.log('baseDataPlantingAreaPathPickedData: ', this.baseDataPlantingAreaPathPickedData);
  let _layer = toRaw(mapProfile.value.subLayers.irrigationGroupLayer);
  if (!_layer) return;

  _layer.renderer = {
    type: "unique-value",
    field: "分區",
    uniqueValueInfos: mapConfigs.value.getUniqueValueInfosForIrrigationGroup()
  }
  let _labelStyle = MapStyle.irrigationGroup.labelingInfo;

  if (store.value.solutionUserPicked.irrigationCombination != null) {
    let _irrigationGroupList = store.value.solutionUserPicked.irrigationCombination.groupList.map(f => `'${f['灌區']}'`)
    _labelStyle[0].where = `分區 in (${_irrigationGroupList.join(',')})`;
  } else {
    _labelStyle[0].where = `分區 in ('桃二','桃三','石一','石二','桃一')`;
  }
  _layer.labelingInfo = _labelStyle;
  // console.log("*_labelStyle:", _labelStyle);
}
// 根據使用者選擇的方案 篩選出對應的標題 水利小組名稱 
function toggleMapWaterGroup() {
  // console.log('##toggleMapWaterGroup');
  let _layer = toRaw(mapProfile.value.subLayers.groupLayer);
  if (!_layer) return;

  _layer.renderer = {
    type: "unique-value",
    field: "工作站名稱",
    uniqueValueInfos: mapConfigs.value.getUniqueValueInfosForWaterGroup()
  }
  let _labelStyle = MapStyle.waterGroup.original.labelingInfo;
  // 根據管理處名稱分組
  let result = Enumerable.from(store.value.userPickedAssociationList)
    .groupBy(item => item.association)
    .select(group => ({
      association: group.key(),
      workstationList: group.select(item => item.workstation).toArray()
    }))
    .toArray();
  // console.log("result:", result);
  let queryString = result
    .map(f => `(管理處名稱='${f.association}' and 工作站名稱 in ('${f.workstationList.join("','")}'))`)
    .join(' or ');


  // console.log("queryString:", queryString);
  // 工作站清單
  // let workstationList = store.value.userPickedAssociationList.map(f => `'${f.workstation}'`)
 
    // 控制水利小組標題
  _labelStyle[0].where = queryString;
  _layer.labelingInfo = _labelStyle;
 
  _layer.definitionExpression = `${queryString}`
  // console.log("definitionExpression:", _layer.definitionExpression)
  // console.log("*_labelStyle:", _labelStyle);

}
// 根據使用者選擇的方案 篩選出對應的標題 工作站名稱 
function toggleMapWorkstation() {
  // console.log('##toggleMapWorkstation');
  let _layer = toRaw(mapProfile.value.subLayers.workstationLayer);
  if (!_layer) return;

  _layer.renderer = {
    type: "unique-value",
    field: "工作站名稱",
    uniqueValueInfos: mapConfigs.value.getUniqueValueInfosForWaterGroup()
  }
  let _labelStyle = MapStyle.workstation.original.labelingInfo;
  // 根據管理處名稱分組
  let result = Enumerable.from(store.value.userPickedAssociationList)
    .groupBy(item => item.association)
    .select(group => ({
      association: group.key(),
      workstationList: group.select(item => item.workstation).toArray()
    }))
    .toArray();
  // console.log("result:", result);
  let queryString = result
    .map(f => `(管理處名稱='${f.association}' and 工作站名稱 in ('${f.workstationList.join("','")}'))`)
    .join(' or ');


  // console.log("queryString:", queryString);
  // 工作站清單
  // let workstationList = store.value.userPickedAssociationList.map(f => `'${f.workstation}'`)
 
    // 控制水利小組標題
  _labelStyle[0].where = queryString;
  _layer.labelingInfo = _labelStyle;
 
  _layer.definitionExpression = `${queryString}`
  // console.log("definitionExpression:", _layer.definitionExpression)
  // console.log("*_labelStyle:", _labelStyle);

}
// 根據使用者選擇的方案 篩選出對應坵塊圖層
function toggleMapFarmingFrequency() {
  // console.log('##toggleMapFarmingFrequency');
  // if (this.ifDevByPassMap) return;
  let landUsingFrequency = store.value.baseDataPlantingAreaPathPickedData?.land_using_frequency

  // //console.log('baseDataPlantingAreaPathPickedData: ', this.baseDataPlantingAreaPathPickedData);
  let _layer = toRaw(mapProfile.value.subLayers.farmingDensity);
  if (!_layer) return;

  if (landUsingFrequency != null) {
    let _where = null;
    if (landUsingFrequency < 6 && landUsingFrequency > 0) {
      _where = '(';
      for (let _y = landUsingFrequency; _y <= 6; _y++) {
        if (_y != landUsingFrequency) {
          _where += ` or `;
        }
        _where += ` years_6 = ${_y} `;
      }
      _where += ')';
    } else {
      _where = `years_6 = ${landUsingFrequency}`;
    }
    // console.log("#@landUsingFrequency:",landUsingFrequency);
    // console.log("#@_where:",_where);
    let _extraWhere = ''
    if (store.value.solutionUserPicked.irrigationCombination != null) {
      //僅限有被挑中的灌區的資料
      let _irrigationGroupList = store.value.solutionUserPicked.irrigationCombination.groupList.map(f => `'${f['灌區']}'`);
      // let groupList = []
      // _irrigationGroupList.forEach((item) => {
      //   let _q = this.$root.getWorkstationListByIrrigationGroup(item);
      //   console.log(item, _q.length);
      //   let workstationList = _q.map(f => `'${f.workstation}'`);
      //   groupList.push(`(管理處名稱 = '${_q[0].association}' and 工作站名稱 in (${workstationList.join(',')}))`)
      // });
      //_extraWhere = groupList.join(' or ');

      _extraWhere += ` 灌區 in (${_irrigationGroupList.join(',')})`;

      // console.log("_extraWhere:", _extraWhere);
    } else {
      let _irrigationGroupList = store.value.userPickedAssociationList.map(f => `'${f}'`)
      // _extraWhere = ` 灌區 in ('桃二','桃三','石一','石二','桃一')`;
      //排除全區非指定灌區外的資料
      let _groupList = Enumerable.from(store.value.uiSettings.irrigationGroupList).groupBy(
        f => f.association
      ).select(
        (g) => {
          // let o = {
          //     association: g.key(), 
          //     workstationList: g.toArray()
          // }
          // return o;
          let _where = `(管理處名稱 = '${g.key()}' and 工作站名稱 in (${(g.toArray().map(f => `'${f.workstation}'`)).join(',')}))`;
          return _where;
        }
      ).toArray();
      // console.log('_groupList', _groupList);

      _extraWhere = _groupList.join(' or ');
      // console.log(_extraWhere);
    }

    if (_extraWhere.length > 0) {
      _where = `${_where} and (${_extraWhere})`;
    }
    // console.log("_where:", _where);
    _layer.definitionExpression = _where;
    // _layer.visible = true;
  } else {
    _layer.visible = false;
  }


}
onMounted(() => {
  // console.log('## map mounted');
  mapStatus.value = 'idle';
})
function destroyMap() {
  const view = toRaw(mapProfile.value.mapView);
  if (view?.destroy) {
    view.destroy();
  }
  mapProfile.value.mapView = null;
  mapProfile.value.mapImageLayer = null;
  mapProfile.value.subLayers = {};
}
onUnmounted(() => {
  isDisposed = true;
  destroyMap();
})
watch(
  () => [
    props.mapConfigs.showPlantingMound,
    props.mapConfigs.showWaterGroup,
    store.value.baseDataPlantingAreaPathPickedData?.land_using_frequency,
    store.value.solutionUserPicked.irrigationCombination?.title,
  ],
  updateMapLayers
)
// watch([store.value.solutionUserPicked.irrigationCombination,store.value.userSettings.step2.baseDataPath.land_using_frequency],()=>{
//     console.log("@@ solutionUserPicked.irrigationCombination is changed")
//     alert("solutionUserPicked.irrigationCombination is changed")
//     toggleMapIrrigationGroup()
//     toggleMapFarmingFrequency()
// }, { deep: true })

</script>

<style scoped lang="scss">
.mapShell {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}
.mapView {
  width: 100%;
  height: 500px;
}
.isHidden {
  visibility: hidden;
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
  background: rgba(255, 255, 255, 0.86);
  color: #334155;
  font-weight: 600;
}
.mapStateError {
  color: #b91c1c;
}
</style>
