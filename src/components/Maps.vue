<template>
  <div class="mapView " :id="mapId">
  </div>
  <!-- {{ store.baseDataPlantingAreaPathPickedData }} -->
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, watchEffect, onMounted, computed, watch, toRaw } from 'vue';
import { useComprehensiveDataStore } from '../stores/comprehensiveDataStore';
import { MapConfigs } from '@/utils/esri-map/map-configs';
import Enumerable from "linq";

import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map";
import WebMap from "@arcgis/core/WebMap.js";
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import MapView from "@arcgis/core/views/MapView";

import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";
import Query from "@arcgis/core/rest/support/Query.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";


import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Basemap from "@arcgis/core/Basemap.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
const props = defineProps({
  mapConfigs: Object,
})
//取得 資料store
const comprehensiveDataStore = useComprehensiveDataStore();
//目前顯示的資料
const store = computed(() => comprehensiveDataStore);

const mapId = ref(uuidv4());
const mapConfigs = ref(null);
const mapProfile = ref({
  mapView: {},
  subLayers: {},
})
function init() {
  mapConfigs.value = new MapConfigs(
    {
      sublayerVisibilities: {
        '16': { visible: true },
        '25': { visible: true },
        '11': { visible: true },
        '39': { visible: props.mapConfigs.showPlantingMound },
        '13': { visible: props.mapConfigs.showWaterGroup},
        // '10': { visible: props.mapConfigs.showWaterGroup },
      }
    }
  );
  let mapImagelayer = new MapImageLayer({
    //gis Map Image Layer
    url:
      "https://gisportal.triwra.org.tw/server/rest/services/BigBossTaoyuanPonds/MapServer",
    sublayers: mapConfigs.value.getSublayers()
  });
  console.log('mapImagelayer:', mapImagelayer);
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
  console.log('map:', map);
  console.log('mapId.value:', mapId.value);
  let view = new MapView({
    map: map,
    // map: webmap,
    //center: [121.2230158, 24.9536558], // Longitude, latitude
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

  view.when(() => {
    view.on('click', (a, b, c) => {
      console.log('view click', a, b, c);
    });

    view.watch("scale", function (newScale) {
      console.log("Updated scale: ", newScale);
    });

    fitAndCeneterMap(view, mapImagelayer);

    toggleMapFarmingFrequency();
    toggleMapIrrigationGroup();
    // toggleMapWaterGroup();
    toggleMapWorkstation();

  })
}
// 根據使用者選擇的方案 篩選出對灌區的大標題
function toggleMapIrrigationGroup() {
  //   console.log('##toggleMapIrrigationGroup');
  //console.log('baseDataPlantingAreaPathPickedData: ', this.baseDataPlantingAreaPathPickedData);
  let _layer = toRaw(mapProfile.value.subLayers.irrigationGroupLayer);

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
  console.log("*_labelStyle:", _labelStyle);
}
// 根據使用者選擇的方案 篩選出對應的標題 水利小組名稱 
function toggleMapWaterGroup() {
  console.log('##toggleMapWaterGroup');
  let _layer = toRaw(mapProfile.value.subLayers.groupLayer);

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
  console.log("result:", result);
  let queryString = result
    .map(f => `(管理處名稱='${f.association}' and 工作站名稱 in ('${f.workstationList.join("','")}'))`)
    .join(' or ');


  console.log("queryString:", queryString);
  // 工作站清單
  // let workstationList = store.value.userPickedAssociationList.map(f => `'${f.workstation}'`)
 
    // 控制水利小組標題
  _labelStyle[0].where = queryString;
  _layer.labelingInfo = _labelStyle;
 
  _layer.definitionExpression = `${queryString}`
  console.log("definitionExpression:", _layer.definitionExpression)
  console.log("*_labelStyle:", _labelStyle);

}
// 根據使用者選擇的方案 篩選出對應的標題 工作站名稱 
function toggleMapWorkstation() {
  console.log('##toggleMapWorkstation');
  let _layer = toRaw(mapProfile.value.subLayers.workstationLayer);

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
  console.log("result:", result);
  let queryString = result
    .map(f => `(管理處名稱='${f.association}' and 工作站名稱 in ('${f.workstationList.join("','")}'))`)
    .join(' or ');


  console.log("queryString:", queryString);
  // 工作站清單
  // let workstationList = store.value.userPickedAssociationList.map(f => `'${f.workstation}'`)
 
    // 控制水利小組標題
  _labelStyle[0].where = queryString;
  _layer.labelingInfo = _labelStyle;
 
  _layer.definitionExpression = `${queryString}`
  console.log("definitionExpression:", _layer.definitionExpression)
  console.log("*_labelStyle:", _labelStyle);

}
function fitAndCeneterMap(_view, _mapImageLayer) {
  let combinedExtent = null;

  // Prepare a query to fetch only visible features for each sublayer
  const query = new Query();
  query.where = "1=1"; // Adjust this as needed, or keep to get all features
  query.returnGeometry = true;
  query.outSpatialReference = _view.spatialReference;

  const sublayerPromises = _mapImageLayer.sublayers.map((sublayer) => {
    // Create a temporary FeatureLayer from each sublayer's URL to perform the query
    const tempFeatureLayer = new FeatureLayer({
      url: `${_mapImageLayer.url}/${sublayer.id}`,
      definitionExpression: sublayer.definitionExpression // Apply any sublayer filters
    });

    return tempFeatureLayer.queryExtent(query).then((result) => {
      if (result.extent) {
        // Combine extents by expanding to include this sublayer's extent
        if (combinedExtent) {
          combinedExtent = combinedExtent.union(result.extent);
        } else {
          combinedExtent = result.extent.clone();
        }
      }
    });
  });

  // Set the view extent once all sublayer extents have been gathered
  Promise.all(sublayerPromises).then(() => {
    if (combinedExtent) {
      _view.goTo(combinedExtent);
    }
  });
}
// 根據使用者選擇的方案 篩選出對應坵塊圖層
function toggleMapFarmingFrequency() {
  // console.log('##toggleMapFarmingFrequency');
  // if (this.ifDevByPassMap) return;
  let landUsingFrequency = store.value.baseDataPlantingAreaPathPickedData.land_using_frequency

  // //console.log('baseDataPlantingAreaPathPickedData: ', this.baseDataPlantingAreaPathPickedData);
  let _layer = toRaw(mapProfile.value.subLayers.farmingDensity);

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

      console.log("_extraWhere:", _extraWhere);
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
      console.log('_groupList', _groupList);

      _extraWhere = _groupList.join(' or ');
      console.log(_extraWhere);
    }

    if (_extraWhere.length > 0) {
      _where = `${_where} and (${_extraWhere})`;
    }
    console.log("_where:", _where);
    _layer.definitionExpression = _where;
    // _layer.visible = true;
  } else {
    _layer.visible = false;
  }


}
onMounted(() => {
  console.log('## map mounted');
  init()
})
// watch([store.value.solutionUserPicked.irrigationCombination,store.value.userSettings.step2.baseDataPath.land_using_frequency],()=>{
//     console.log("@@ solutionUserPicked.irrigationCombination is changed")
//     alert("solutionUserPicked.irrigationCombination is changed")
//     toggleMapIrrigationGroup()
//     toggleMapFarmingFrequency()
// }, { deep: true })

</script>

<style scoped lang="scss">
.mapView {
  width: 100%;
  height: 100%;
  height: 500px;
}
</style>