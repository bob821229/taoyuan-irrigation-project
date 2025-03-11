async function loadDataFromCombinationUserPicked(_waterNeedsCalculator, userSettings, baseDataFilterCallback) {
  //setTimeout(async () => this.waterNeeds = await this.waterNeedsCalculator.getWaterNeeds(), 1000)

  let _compareSettings = copyJsonObject(userSettings.step1);
  _compareSettings.baseDataPath = userSettings.step2.baseDataPath;
  _compareSettings.fieldWaterNeedPercentage = userSettings.step2.fieldWaterNeedPercentage;
  _compareSettings.irrigationOrganizationTendaysWaterUsage = userSettings.irrigationOrganizationTendaysWaterUsage;
  _compareSettings.reservoirGivingTendaysWater = userSettings.reservoirGivingTendaysWater;

  _compareSettings.baseDataFilterCallback = baseDataFilterCallback;

  console.log('_compareSettings', _compareSettings);
  await _waterNeedsCalculator.calculate(
      _compareSettings
  );

  let simulationData = {};
  simulationData.baseData = await _waterNeedsCalculator.getBaseData();     //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
  console.log('baseData', simulationData.baseData);
  simulationData.outcomes = await _waterNeedsCalculator.getOutcomes();
  simulationData.reservoirWaterStoarage = await _waterNeedsCalculator.getReservoirWaterStoarage();
  simulationData.areaWaterNeedsByIrrigationGroup = await _waterNeedsCalculator.getAreaWaterNeedsByIrrigationGroup();
  //this.prefix = _waterNeedsCalculator.prefix;
  //console.log('loadData', this.userSettings.step2.baseDataPath.value, this.compareSimulationData);

  return simulationData;
}

function chartLineSourceDataToList(sourceData) {
  let obj = {};
      let keyList = Object.keys(sourceData);
      keyList.forEach(key => {
        obj[key] = sourceData[key];
      });
      let list = [obj];
      return list;

}