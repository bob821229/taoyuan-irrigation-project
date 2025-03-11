import { ApiCaller } from './ApiCallerModule.js';
import { AgricultureCalendar } from './AgricultureCalendar.js';
import axios from 'axios';
import Enumerable from 'linq'
class WaterNeedsCalculator {
    AgricultureCalendar = null;
    tenDayPeriodBaseDataList = null;
    tenDayPeriodList = null;


    userPickedInflowPredictionIndexByTendaysList = [];

    pondDiscountData = 0;

    //有被選進計算『可供灌面積』的 圳路代碼
    //pickedBranchNumberList = ["1", "2", "3", "4", "5", "6", "7", "8-1", "8", "9", "10", "11", "12", "12-1", "13", "14"];
    pickedBranchNumberList = ["1", "2", "3", "4", "5", "6", "7", "8-1", "8", "9", "10", "11", "12", "12-1", "13", "14", "1", "6", "7", "5", "2", "4", "3", "8", "13", "9", "12", "11", "10", "14", "15", "16"];

    decisionMakingDateListMappingInflowsSettings = [
        { text: '11-01', days: 92, tenDaysRangeList: [{ startIdx: 30, endIdx: 35 }, { startIdx: 0, endIdx: 2 }] },
        { text: '12-01', days: 62, tenDaysRangeList: [{ startIdx: 33, endIdx: 35 }, { startIdx: 0, endIdx: 2 }] },
        { text: '01-01', days: 31, tenDaysRangeList: [{ startIdx: 0, endIdx: 2 }] },
        { text: '02-01', days: 0, tenDaysRangeList: [] },
    ];

    baseWaterDataByWaterGroupFieldName = [
        "站別",
        "圳路別",
        "支線別_(大漢溪水系各圳若無區分支線則不必填寫)_(幹線直灌請填寫幹直；導水路取水請填寫導水路直接)",
        "圳路代碼",
        "小組別",
        "小組別1",
        "水利小組編號",
        "埤塘",
        "埤塘總庫容(m3)",
        "田間輸水損失率",
        "水庫配水輸水損失率",
        "水稻供灌面積(公頃)",
        "2月上旬",
        "2月中旬",
        "2月下旬",
        "3月上旬",
        "3月中旬",
        "3月下旬",
        "4月上旬",
        "4月中旬",
        "4月下旬",
        "5月上旬",
        "5月中旬",
        "5月下旬",
        "6月上旬",
        "6月中旬",
        "6月下旬",
        "7月上旬",
        "7月中旬",
        "7月下旬",
        "合計",
        "旱作需水量",
        "管理處名稱",
        "管理處編號",
        "工作站名稱",
        "工作站編號",
        "waterGroupName",
        "灌區"
    ];

    prefix = {
        fieldWaterNeeds: '田間需水量',

        ditchWaterNeeds: '水門需水量_萬噸',

        pondRemainsPerTendays: '埤塘每旬剩水',

        subCanalRequirementsPrefix: `支線取入量(先用埤塘水，用完再取支線)`,

        reservoirAssignment: '大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]',
    };
    userSettings = {
        //farmingPeriod: 1,
        decisionMakingDate: '',
        perdictAt: '02-01',   //決策時間
        simulationWaterStorage10kTons: 12000,   //初始蓄水量S0
        publicWaterUsage10kTonsPerDay: 100, //每日民生公共需水D
        safeWaterStorage10kTons: 2800,  //安全蓄水量QB
        shimenReservoirInflowPredictionIndex: 'I95',  //超越機率入流量
        baseDataPath: {
            text: "民國102-103年平均種植面積",
            value: "/data/water-needs-base-data/field-water-need-list-planting-roc-year-104-pond-current-storage-included-ia-20251113.json",
            land_using_frequency: 102103,
        }
    }

    constructor() {
        // console.log('WaterNeedsCalculator', axios);
        this.dataAccess = new ApiCaller({
            axios: axios,
            finallyCallback: function () {
                console.log("finally");
            },
        });
        this.outcomes = {   //計算後需要在頁面呈現的資料
            reservoirWaterAssignmentsByTenDaysList: [],   //以『支線』為單位的 『每旬』 『大圳配水量(萬噸)』

            reservoirWaterTotalAssignmentsByTendays: {},//各旬總需配水量
            reservoirWaterUnitAssignmentsByTendays: {},//各旬單位面積配水量

            reservoirAvailableWaterByTendays: {}, //可用水量
            plantingAreaAvailableToIrrigatedByReservoirWaterByTendays: {}, //可供灌面積

            minPlantingAreaAvailableToIrrigatedByReservoirWater: 0, //至少可供灌面積 minAA
            availableWaterForAgriculture: 0,    //可供灌農業水資源W

            summaryByWorkstation: []    //以工作站為單位的統計數據
        }
        this.dataFromApi = {    //從API抓的資料
            baseWaterDataByWaterGroup: [],
            shimenReservoirInflowsPredictionIndexByTendaysList: []  //石門水庫 (超越機率)入流量預測
        };
        this.reservoirWaterStoarage = { //石門水庫預測蓄水量
            initWaterStorageByDecisionMakingDate: 0,

            //satelliteRecognitionAvg5YrsArea: [], //平均五年判釋面積
            satelliteRecognitionAvg5YrsArea: {}, //平均五年判釋面積
            //第4旬(二上)
            //  依決策時間算出的初始蓄水量
            //第5旬後
            //  前一旬入蓄水量 - 前一旬配水量 - 民生公共用水 * 前一旬天數 + 『入流量預測指標』的前一旬入流量

            //areaAvgBBversion: [], //可供灌面積(院長)
            areaAvgBBversion: {}, //可供灌面積(院長)
            //第4旬(二上)
            //  依決策時間算出的初始蓄水量
            //第5旬後
            //  前一旬入蓄水量 - 前一旬配水量 * 至少可供灌面積 minAA - 民生公共用水 * 前一旬天數 + 『入流量預測指標』的前一旬入流量

            //publicWaterUsageDeduction: [], //扣除民生公共用水
            publicWaterUsageDeduction: {}, //扣除民生公共用水
            //第4旬(二上)
            //  依決策時間算出的初始蓄水量
            //第5旬後
            //  前一旬入蓄水量 - 前一旬配水量 * 至少可供灌面積 minAA - 民生公共用水 * 前一旬天數 + 『入流量預測指標』的前一旬入流量

            //入流量
            includeInflowPrediction: {},

            //afterIrrigationScheduleOrganiztion: [], //扣錯整田錯開
            afterIrrigationScheduleOrganiztion: {}, //扣錯整田錯開

            //afterWaterGivingSimulation: [], //扣除方案供水模擬
            afterWaterGivingSimulation: {}, //扣除方案供水模擬

        }
        this.ifGotBaseData = false;

        this.AgricultureCalendar = new AgricultureCalendar();
        this.tenDayPeriodBaseDataList = this.AgricultureCalendar.getTenDaysPeriodList();
        this.tenDayPeriodList = this.AgricultureCalendar.getTenDaysPeriodList({
            tenDaysNumberStart: 4,
            tenDaysNumberEnd: 21
        });

        //console.log(this.tenDayPeriodBaseDataList, this.tenDayPeriodList)
    }

    parseTendaysFieldsToList(sourceList, columnPrefix, extraColumnMappingArray) {
        let list = [];
        sourceList.forEach(row => {
            let obj = {
                "灌區": row['灌區'],
                "站別": row['站別'],
                "小組別": row['小組別'],
                "水稻供灌面積(公頃)": row['水稻供灌面積(公頃)'],
            };
            this.tenDayPeriodList.forEach(tendaysObject => {
                obj[tendaysObject.text] = row[`${columnPrefix}${tendaysObject.text}`];
            });

            if (extraColumnMappingArray != null) {
                extraColumnMappingArray.forEach(mapping => {
                    obj[mapping.newColumnName] = row[mapping.originalColumnName];
                });
            }

            list.push(obj);
        });
        return list;
    }

    //getter-begin
    async getBaseData() {

        //console.log('await async', 'after calculate');

        //田間需水量
        this.dataFromApi[this.prefix.fieldWaterNeeds] = this.parseTendaysFieldsToList(
            this.dataFromApi.baseWaterDataByWaterGroup,
            '',
            [{ newColumnName: "合計", originalColumnName: "合計" }]
        );

        //水門需水量_萬噸
        this.dataFromApi[this.prefix.ditchWaterNeeds] = this.parseTendaysFieldsToList(
            this.dataFromApi.baseWaterDataByWaterGroup,
            `${this.prefix.ditchWaterNeeds}_`,
            [
                { newColumnName: `${this.prefix.ditchWaterNeeds}_合計`, originalColumnName: "合計" },
                { newColumnName: `${this.prefix.ditchWaterNeeds}_水門需水量(考慮旱作蓄水量)`, originalColumnName: "水門需水量(考慮旱作蓄水量)" },
                { newColumnName: `${this.prefix.ditchWaterNeeds}_期作支線取入量(萬噸)`, originalColumnName: "期作支線取入量(萬噸)" },
                { newColumnName: `埤塘實際用水`, originalColumnName: "埤塘實際用水" },

            ]
        );

        //埤塘每旬剩水
        this.dataFromApi[this.prefix.pondRemainsPerTendays] = this.parseTendaysFieldsToList(
            this.dataFromApi.baseWaterDataByWaterGroup,
            `${this.prefix.pondRemainsPerTendays}_`,
        );

        //支線取入量(先用埤塘水，用完再取支線)
        this.dataFromApi[this.prefix.subCanalRequirementsPrefix] = this.parseTendaysFieldsToList(
            this.dataFromApi.baseWaterDataByWaterGroup,
            `${this.prefix.subCanalRequirementsPrefix}_`,
            [
                { newColumnName: `${this.prefix.subCanalRequirementsPrefix}_合計`, originalColumnName: "合計" },
            ]
        );

        //大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]
        this.dataFromApi[this.prefix.reservoirAssignment] = this.parseTendaysFieldsToList(
            this.dataFromApi.baseWaterDataByWaterGroup,
            `${this.prefix.reservoirAssignment}_`,
            [
                { newColumnName: `${this.prefix.reservoirAssignment}_合計`, originalColumnName: "合計" },
                { newColumnName: `大配水合計`, originalColumnName: "大配水合計" },
                { newColumnName: `旱作大圳配水`, originalColumnName: "旱作大圳配水" },
                { newColumnName: `總大圳配水`, originalColumnName: "總大圳配水" },
            ]
        );
        //
        // console.log('getBaseData', this.dataFromApi);

        this.dataFromApi.baseWaterDataByWaterGroupFieldName = this.baseWaterDataByWaterGroupFieldName;

        return new Promise(
            (resolve) => {
                resolve(this.dataFromApi)
            });
    }
    async getOutcomes() {
        //console.log('await async', 'after calculate');
        return new Promise(
            (resolve) => {
                resolve(this.outcomes)
            });
    }
    async getReservoirWaterStoarage() {
        //console.log('await async', 'after calculate');
        return new Promise(
            (resolve) => {
                resolve(this.reservoirWaterStoarage)
            });
    }
    async getAreaWaterNeedsByIrrigationGroup() {
        if (this.dataFromApi[this.prefix.reservoirAssignment] == null) {
            //console.log(`this.dataFromApi[${this.prefix.reservoirAssignment}] 不存在`)
            return null;
        }

        let irrigationGroup = Enumerable.from(
            this.dataFromApi[this.prefix.reservoirAssignment]
        ).groupBy(
            g => g['灌區']
        ).select(g => {
            let obj = {
                '灌區': g.key(),
                '供灌面積': g.sum(f => f['水稻供灌面積(公頃)']),
                '供灌需水量':
                    g.sum(f => f[`大配水合計`]),
                //g.sum(f=>f[`${this.prefix.reservoirAssignment}_合計`]),
            };
            return obj;
        }).toArray();

        return irrigationGroup;
    }
    //getter-end


    //call api - begin
    async loadWaterNeedsBaseData() {
        // console.log('await async', 'loadWaterNeedsBaseData', this.userSettings.baseDataPath.value);

        // let _baseData = await this.dataAccess.getData(
        //     {
        //         //path: '/irrigation-plan-water-group-field-water-need-list'
        //         // path: '/irrigation-v3/irrigation-plan-water-group-field-water-need-list'
        //         // path: '/irrigation-v3/field-water-needs-beyond-3yrs'
        //         // path: '/irrigation-v3/field-water-needs-beyond-4yrs'
        //         // path: '/irrigation-v3/field-water-needs-beyond-5yrs'
        //         // path: '/irrigation-v3/field-water-needs-5yrs-avg'
        //         path: this.userSettings.baseDataPath
        //     }
        // );
        let _baseData = null;
        let x = await this.dataAccess.callAsync({
            apiItem: {
                uri: this.userSettings.baseDataPath.value,
                method: 'get'
            },
        }).then((res) => {
            let _data = res.data;
            _baseData = _data;
        });

        //排除站別：大溪、新莊、海山；小組別：水尾小組(站別為null)
        _baseData = Enumerable.from(_baseData).where(
            f => f['站別'] != '大溪'
                && f['站別'] != '新莊'
                && f['站別'] != '海山'
                && f['站別'] != ''
                && f['站別'] != null
            //&& f['小組別'] != '水尾小組'
        ).toArray();

        if (this.userSettings.baseDataFilterCallback != null) {
            _baseData = this.userSettings.baseDataFilterCallback(_baseData);
        }

        this.dataFromApi.baseWaterDataByWaterGroup = _baseData;
        // console.log('await async', 'loadWaterNeedsBaseData', this.dataFromApi.baseWaterDataByWaterGroup.length, this.dataFromApi.baseWaterDataByWaterGroup);

        // this.dataFromApi.shimenReservoirInflowsPredictionIndexByTendaysList = await this.dataAccess.getData(
        //     {
        //         path: '/irrigation-v3/shimen-reservoir-inflows-prediction'
        //     }
        // );
        let y = await this.dataAccess.callAsync({
            apiItem: {
                uri: './data/water-needs-base-data/shimen-reservoir-inflows-prediction.json',
                method: 'get'
            },
        }).then((res) => {
            let _data = res.data;
            this.dataFromApi.shimenReservoirInflowsPredictionIndexByTendaysList = _data;
            // console.log('this.dataFromApi.shimenReservoirInflowsPredictionIndexByTendaysList', this.dataFromApi.shimenReservoirInflowsPredictionIndexByTendaysList);
        });
        //console.log('dataFromApi.shimenReservoirInflowsPredictionIndexByTendaysList', this.dataFromApi.shimenReservoirInflowsPredictionIndexByTendaysList);

        this.ifGotBaseData = true;


    }
    //call api - end

    async calculate(_userSettings) {
        this.userSettings = _userSettings;
        //console.log(_userSettings);
        //console.log(this.userSettings);

        if (!this.ifGotBaseData) {
            await this.loadWaterNeedsBaseData();
        }

        if (this.userSettings.fieldWaterNeedPercentage == null) {
            this.userSettings.fieldWaterNeedPercentage = 100;
        }

        //使用者選的超越機率入流量
        this.userPickedInflowPredictionIndexByTendaysList = Enumerable.from(this.dataFromApi.shimenReservoirInflowsPredictionIndexByTendaysList).where(f => f['石門水庫入流量Index'] == this.userSettings.shimenReservoirInflowPredictionIndex).first();

        this.calculateBaseData();

        this.calculateInitReservoirStorage();

        this.calculateAvailableAreaToBeIrrigated();

        this.calculateReservoirWaterStorageByTendays();

        this.calculateSummaryByWorkstation();

        this.calculateTendaysWaterUsageByIrrgationGroup();
    }

    //計算：從決策日推算2/1的初始蓄水量-begin
    calculateInitReservoirStorage() {
        //決策日推算的初始蓄水量公式
        // Date初始蓄水量 = 使用者設定的『初始蓄水量S0』- 天數 * 每日民生公共需水 + 決策日前的『入流量預測指標』的前一旬入流量加總
        //  11/1 =$B$27-92*$B$28+SUM(VLOOKUP($B30,$AG$31:$BQ$37,BL$28:BQ$28))+SUM(VLOOKUP($B30,$AG$31:$BQ$37,AH$28:AJ$28))
        //  12/1 =$B$27-62*$B$28+SUM(VLOOKUP($B$30,$AG$31:$BQ$37,BO$28:BQ$28))+SUM(VLOOKUP($B30,$AG$31:$BQ$37,AH$28:AJ$28))
        //  1/1 =$B$27-31*$B$28+SUM(VLOOKUP($B$30,$AG$31:$BQ$37,AH$28:AJ$28))
        //  2/1 =$B$27

        let ref = Enumerable.from(this.decisionMakingDateListMappingInflowsSettings).where(f => f.text == this.userSettings.decisionMakingDate).first();

        //console.log('calculateInitReservoirStorage', ref, this.userPickedInflowPredictionIndexByTendaysList);
        let predictionInflowsTotal = 0;
        ref.tenDaysRangeList.forEach(rangeObject => {
            for (let s = rangeObject.startIdx; s <= rangeObject.endIdx; s++) {
                //console.log(this.tenDayPeriodBaseDataList[s].text);
                predictionInflowsTotal += this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodBaseDataList[s].text];
            }
        });

        this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate =
            this.userSettings.simulationWaterStorage10kTons - ref.days * this.userSettings.publicWaterUsage10kTonsPerDay + predictionInflowsTotal;

        console.log(`${this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate} =
            ${this.userSettings.simulationWaterStorage10kTons} - ${ref.days} * ${this.userSettings.publicWaterUsage10kTonsPerDay} + ${predictionInflowsTotal};`);
        //alert('calculateInitReservoirStorage');
        //console.log('calculateInitReservoirStorage', predictionInflowsTotal, this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate);
    }

    calculateReservoirWaterStorageByTendays() {
        // alert('calculateReservoirWaterStorageByTendays');
        // alert(this.tenDayPeriodList.length);
        //平均五年判釋面積
        // console.log('calculateReservoirWaterStorageByTendays', this.tenDayPeriodList)
        this.tenDayPeriodList.forEach((obj, idx) => {
            let fieldName = this.tenDayPeriodList[idx].text;
            //let fieldNameAdd1 = (idx >= this.tenDayPeriodList.length - 1) ? null : this.tenDayPeriodList[idx + 1].text;

            if (idx == 0) {
                let value = this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate;
                this.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[fieldName] = value;
                this.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion[fieldName] = value;
                this.reservoirWaterStoarage.afterWaterGivingSimulation[fieldName] = value;

                // console.log('calculateReservoirWaterStorageByTendays', `${idx} ${this.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[fieldName]} = ${this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate};`);
            } else {
                let value =
                    this.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[this.tenDayPeriodList[idx - 1].text] -
                    this.outcomes.reservoirWaterTotalAssignmentsByTendays[this.tenDayPeriodList[idx - 1].text] -    //新圖要換掉的
                    this.userSettings.publicWaterUsage10kTonsPerDay *
                    this.tenDayPeriodList[idx - 1].days +
                    this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]
                    ;
                this.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[fieldName] = value;

                // console.log(`calculateReservoirWaterStorageByTendays, idx: ${idx}, ${this.tenDayPeriodList[idx - 1].text}`, 
                //     `
                //     ${this.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[this.tenDayPeriodList[idx - 1].text]} -
                //     ${this.outcomes.reservoirWaterTotalAssignmentsByTendays[this.tenDayPeriodList[idx - 1].text]} -
                //     ${this.userSettings.publicWaterUsage10kTonsPerDay} *
                //     ${this.tenDayPeriodList[idx - 1].days} +
                //     ${this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]}
                //     `);

                // console.log('cal irrigationOrganizationTendaysWaterUsage', this.userSettings.irrigationOrganizationTendaysWaterUsage);
                if (this.userSettings.irrigationOrganizationTendaysWaterUsage != null) {
                    value =
                        this.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion[this.tenDayPeriodList[idx - 1].text] -
                        //(this.outcomes.reservoirWaterTotalAssignmentsByTendays[this.tenDayPeriodList[idx - 1].text] + 500) -    //新圖要換掉的
                        this.userSettings.irrigationOrganizationTendaysWaterUsage[this.tenDayPeriodList[idx - 1].text] -
                        this.userSettings.publicWaterUsage10kTonsPerDay *
                        this.tenDayPeriodList[idx - 1].days +
                        this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]
                        ;
                    this.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion[fieldName] = value;
                    //this.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion[fieldNameAdd1] = value;


                    // console.log(`整田錯開後, idx: ${idx}, ${this.tenDayPeriodList[idx - 1].text}`, 
                    //     `
                    //     ${this.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion[this.tenDayPeriodList[idx - 1].text]} -
                    //     ${this.userSettings.irrigationOrganizationTendaysWaterUsage[this.tenDayPeriodList[idx - 1].text]} -
                    //     ${this.userSettings.publicWaterUsage10kTonsPerDay} *
                    //     ${this.tenDayPeriodList[idx - 1].days} +
                    //     ${this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]}
                    //     `
                    // , this.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion[fieldName]);
                }

                if(this.userSettings.reservoirGivingTendaysWater != null){
                    value =
                        this.reservoirWaterStoarage.afterWaterGivingSimulation[this.tenDayPeriodList[idx - 1].text] -
                        //(this.outcomes.reservoirWaterTotalAssignmentsByTendays[this.tenDayPeriodList[idx - 1].text] + 1000) -    //新圖要換掉的
                        this.userSettings.reservoirGivingTendaysWater[this.tenDayPeriodList[idx - 1].text] - 
                        this.userSettings.publicWaterUsage10kTonsPerDay *
                        this.tenDayPeriodList[idx - 1].days +
                        this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]
                        ;
                    this.reservoirWaterStoarage.afterWaterGivingSimulation[fieldName] = value;
                    //this.reservoirWaterStoarage.afterWaterGivingSimulation[fieldNameAdd1] = value;
                    
                    // console.log(`水庫給水後, idx: ${idx}, ${this.tenDayPeriodList[idx - 1].text}`, 
                    //     `
                    //     ${this.reservoirWaterStoarage.afterWaterGivingSimulation[this.tenDayPeriodList[idx - 1].text]} -
                    //     ${this.userSettings.reservoirGivingTendaysWater[this.tenDayPeriodList[idx - 1].text]} - 
                    //     ${this.userSettings.publicWaterUsage10kTonsPerDay} *
                    //     ${this.tenDayPeriodList[idx - 1].days} +
                    //     ${this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]}
                    //     `
                    // , this.reservoirWaterStoarage.afterWaterGivingSimulation[fieldName]);
                }

            }
        });
        //第4旬(二上)
        //  依決策時間算出的初始蓄水量
        //第5旬後
        //  前一旬入蓄水量 - 前一旬總需配水量 - 民生公共用水 * 前一旬天數 + 『入流量預測指標』的前一旬入流量
        //=C34-C20-$B$28*AK$29+VLOOKUP($B30,$AG$31:$BQ$37,AK$28)
        //console.log('水庫蓄水量-平均五年判釋面積', this.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea);


        //可供灌面積(院長)
        this.tenDayPeriodList.forEach((obj, idx) => {
            let fieldName = this.tenDayPeriodList[idx].text;

            if (idx == 0) {
                this.reservoirWaterStoarage.areaAvgBBversion[fieldName] = this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate;
            } else {
                let value =
                    this.reservoirWaterStoarage.areaAvgBBversion[this.tenDayPeriodList[idx - 1].text] -
                    this.outcomes.reservoirWaterUnitAssignmentsByTendays[this.tenDayPeriodList[idx - 1].text] *
                    this.outcomes.minPlantingAreaAvailableToIrrigatedByReservoirWater -
                    this.userSettings.publicWaterUsage10kTonsPerDay *
                    this.tenDayPeriodList[idx - 1].days +
                    this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]
                    ;
                this.reservoirWaterStoarage.areaAvgBBversion[fieldName] = value;
            }
        });
        //console.log('水庫蓄水量-可供灌面積(院長)', this.reservoirWaterStoarage.areaAvgBBversion);
        //第4旬(二上)
        //  依決策時間算出的初始蓄水量
        //第5旬後
        //  前一旬入蓄水量 - 前一旬單位面積配水量 * 至少可供灌面積 minAA - 民生公共用水 * 前一旬天數 + 『入流量預測指標』的前一旬入流量
        //=C35-C21*$M$28-$B$28*AK$29+VLOOKUP($B30,$AG$31:$BQ$37,AK$28)


        //扣除民生公共用水
        this.tenDayPeriodList.forEach((obj, idx) => {
            let fieldName = this.tenDayPeriodList[idx].text;

            if (idx == 0) {
                this.reservoirWaterStoarage.publicWaterUsageDeduction[fieldName] = this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate;
            } else {
                let value =
                    this.reservoirWaterStoarage.publicWaterUsageDeduction[this.tenDayPeriodList[idx - 1].text] -
                    this.userSettings.publicWaterUsage10kTonsPerDay *
                    this.tenDayPeriodList[idx - 1].days +
                    this.userPickedInflowPredictionIndexByTendaysList[this.tenDayPeriodList[idx - 1].text]
                    ;
                this.reservoirWaterStoarage.publicWaterUsageDeduction[fieldName] = value;
            }
        });
        //console.log('水庫蓄水量-扣除民生公共用水', this.reservoirWaterStoarage.publicWaterUsageDeduction);

        // this.reservoirWaterStoarage.publicWaterUsageDeduction.push(
        //     {
        //         text: this.tenDayPeriodList[0],
        //         value: this.initWaterStorageByDecisionMakingDate
        //     }
        // )
        //第4旬(二上)
        //  依決策時間算出的初始蓄水量
        //第5旬後
        //  前一旬入蓄水量 - 每日民生公共需水D * 前一旬天數 + 『入流量預測指標』的前一旬入流量
        // =C36-$B$28*AK29+VLOOKUP($B30,$AG$31:$BQ$37,AK28)

        //入流量
        //this.reservoirWaterStoarage.includeInflowPrediction

        // console.log('result of reservoirWaterStoarage', this.reservoirWaterStoarage)
    }
    //計算：從決策日推算2/1的初始蓄水量-end

    //計算：以灌區為單位的各旬用水量-begin
    calculateTendaysWaterUsageByIrrgationGroup() {
        let list = Enumerable.from(this.dataFromApi.baseWaterDataByWaterGroup)
            .groupBy(
                f => `${f['灌區']}`
            )
            .select(
                g => {
                    let obj = {
                        '灌區': g.key().split('||')[0]
                    };
                    this.tenDayPeriodList.forEach(tendaysObj => {
                        obj[tendaysObj.text] = g.sum(f => f[`${this.prefix.reservoirAssignment}_${tendaysObj.text}`])
                    });
                    return obj;
                }
            )
            .toArray();
        this.outcomes.tendaysWaterUsageByIrrigationGroup = list;
        //this.tenDayPeriodList.forEach()
    }
    //計算：以灌區為單位的各旬用水量-end

    //計算：以工作站為單位的數據-begin
    calculateSummaryByWorkstation() {
        let list = Enumerable.from(this.dataFromApi.baseWaterDataByWaterGroup)
            //.where(f => this.pickedBranchNumberList.indexOf(f['圳路代碼']) >= 0)
            .groupBy(f => {
                return `${f['灌區']}||${f['站別']}`;
            })
            .select(g => {
                let irrigationGroup = g.key().split('||')[0];
                let obj = {
                    '灌區排序': getIrrigationGroupSeq(irrigationGroup),
                    '灌區': irrigationGroup,
                    '站別': g.key().split('||')[1],
                    //list: g.toArray(), 
                    '灌溉面積(一期作)': g.sum(f => f['水稻供灌面積(公頃)']),
                    '田間需水量': g.sum(f => f[`合計`]),
                    // '旱作灌溉面積(近五年判釋平均)': 3, 
                    // '旱作需水量': 4,
                    '支線取入量': g.sum(f => f[`${this.prefix.subCanalRequirementsPrefix}_合計`]),
                    '大圳配水量': g.sum(f => f['大配水合計']),
                    '田間輸水損失率(%)': 6,
                };
                return obj;
            }
            )
            .orderBy(f => f['灌區排序'])
            .toArray();

        list.forEach(row => {
            row['田間輸水損失率(%)'] = (1 - row['田間需水量'] / row['大圳配水量']) * 100;
        });

        this.outcomes.summaryByWorkstation = list;
    }
    //計算：以工作站為單位的數據-end

    //可供灌面積計算-begin
    calculateAvailableAreaToBeIrrigated() {
        let branchGroupForReservoirWaterAssignmentList = Enumerable.from(this.dataFromApi.baseWaterDataByWaterGroup)
            .where(f => this.pickedBranchNumberList.indexOf(f['圳路代碼']) >= 0)
            .groupBy(f => {
                return `${f['圳路代碼']}||${f['站別']}`;
                //return {'圳路代碼': f['圳路代碼'], '站別': f['站別']};
            })
            .select(g => {
                let obj = {
                    '站別': g.key().split('||')[1],
                    '圳路代碼': g.key().split('||')[0],
                    '支線別_(大漢溪水系各圳若無區分支線則不必填寫)_(幹線直灌請填寫幹直；導水路取水請填寫導水路直接)': g.first()['支線別_(大漢溪水系各圳若無區分支線則不必填寫)_(幹線直灌請填寫幹直；導水路取水請填寫導水路直接)'],
                    list: g.toArray()
                };
                return obj;
            }
            )
            .toArray();

        // console.log('branchGroupForReservoirWaterAssignmentList', branchGroupForReservoirWaterAssignmentList);
        //計算以 圳路代碼 為主的每旬 大圳配水量(萬噸)
        branchGroupForReservoirWaterAssignmentList.forEach(f => {
            let branchRow = {
                '站別': f['站別'],
                '圳路代碼': f['圳路代碼'],
                '支線別_(大漢溪水系各圳若無區分支線則不必填寫)_(幹線直灌請填寫幹直；導水路取水請填寫導水路直接)': f['支線別_(大漢溪水系各圳若無區分支線則不必填寫)_(幹線直灌請填寫幹直；導水路取水請填寫導水路直接)'],
                '合計': 0,
                '面積': 0,
            };
            this.tenDayPeriodList.forEach(tenDayObj => {
                branchRow[tenDayObj.text] = 0;
            });

            //loop 每筆資料
            f.list.forEach(_r => {
                this.tenDayPeriodList.forEach(tenDayObj => {
                    let fName = `${this.prefix.reservoirAssignment}_${tenDayObj.text}`;
                    branchRow[tenDayObj.text] += _r[fName];
                });
                branchRow['面積'] += _r['水稻供灌面積(公頃)'];
            });

            let branchTotal = 0;
            this.tenDayPeriodList.forEach(tenDayObj => {
                branchTotal += branchRow[tenDayObj.text];
            });

            branchRow['合計'] = branchTotal;


            this.outcomes.reservoirWaterAssignmentsByTenDaysList.push(branchRow);
        });

        //計算 『各旬總需配水量』-begin
        let summaryObj = {
            name: '',
            '合計': 0,
            '面積': 0,
        };
        this.tenDayPeriodList.forEach(tenDayObj => {
            summaryObj[tenDayObj.text] = 0;
        });
        this.outcomes.reservoirWaterAssignmentsByTenDaysList.forEach(f => {
            this.tenDayPeriodList.forEach(tenDayObj => {
                summaryObj[tenDayObj.text] += f[tenDayObj.text];
            });
            summaryObj['合計'] += f['合計'];
            summaryObj['面積'] += f['面積'];
        });

        this.outcomes.reservoirWaterTotalAssignmentsByTendays = summaryObj;
        //計算 『各旬總需配水量』-end

        //計算 『各旬單位面積配水量』-begin
        let reservoirWaterAssignmentPerAreaUnit = {
            name: '各旬單位面積配水量',
            '合計': summaryObj['合計'] / summaryObj['面積'],
        };
        this.tenDayPeriodList.forEach(tenDayObj => {
            reservoirWaterAssignmentPerAreaUnit[tenDayObj.text] = summaryObj[tenDayObj.text] / summaryObj['面積'];
        });
        this.outcomes.reservoirWaterUnitAssignmentsByTendays = reservoirWaterAssignmentPerAreaUnit;
        //計算 『各旬單位面積配水量』-end

        //計算 各旬 可用水量-begin
        this.tenDayPeriodList.forEach((tenDayObj, idx) => {
            let value = 0
            if (idx == 0) {
                //=C35-B29-$B28*AK29+VLOOKUP($B30,$AG$31:$BQ$37,AK28)
                //初始蓄水量 - 安全蓄水量 - 每日民生公共需水量 * 當旬天數 + 前一旬超越機率入流量
                value = this.reservoirWaterStoarage.initWaterStorageByDecisionMakingDate -
                    this.userSettings.safeWaterStorage10kTons -
                    this.userSettings.publicWaterUsage10kTonsPerDay * tenDayObj.days +
                    this.userPickedInflowPredictionIndexByTendaysList[tenDayObj.text];
            } else {
                //=C23-$B28*AL29+VLOOKUP($B30,$AG$31:$BQ$37,AL28)
                //前旬可用水量 - 每日民生公共需水量 * 當旬天數
                value = this.outcomes.reservoirAvailableWaterByTendays[this.tenDayPeriodList[idx - 1].text] -
                    this.userSettings.publicWaterUsage10kTonsPerDay * tenDayObj.days +
                    this.userPickedInflowPredictionIndexByTendaysList[tenDayObj.text];
            }
            this.outcomes.reservoirAvailableWaterByTendays[tenDayObj.text] = value;
        });
        //console.log('各旬 可用水量', this.outcomes.reservoirAvailableWaterByTendays);
        //計算 各旬 可用水量-end

        //計算 各旬 可供灌面積-begin
        this.tenDayPeriodList.forEach((tenDayObj, idx) => {
            //當旬可用水量 / Sum(2月上旬~當旬 單位面積配水量)
            let dividend = 0;
            for (let s = 0; s <= idx; s++) {
                dividend += this.outcomes.reservoirWaterUnitAssignmentsByTendays[this.tenDayPeriodList[s].text];
            }
            let value = this.outcomes.reservoirAvailableWaterByTendays[tenDayObj.text] / dividend;

            this.outcomes.plantingAreaAvailableToIrrigatedByReservoirWaterByTendays[tenDayObj.text] = value;
        });
        //console.log('各旬 可供灌面積', this.outcomes.plantingAreaAvailableToIrrigatedByReservoirWaterByTendays);
        //計算 各旬 可供灌面積-end

        let __obj = Object.values(this.outcomes.plantingAreaAvailableToIrrigatedByReservoirWaterByTendays);
        //console.log('__obj', __obj);
        this.outcomes.minPlantingAreaAvailableToIrrigatedByReservoirWater = Math.min(...__obj);
        //console.log('至少可供灌面積 minAA', this.outcomes.minPlantingAreaAvailableToIrrigatedByReservoirWater);

        //可供灌農業水資源W = 至少可供灌面積(minAA) * reservoirWaterUnitAssignmentsByTendays['合計']
        this.outcomes.availableWaterForAgriculture = this.outcomes.minPlantingAreaAvailableToIrrigatedByReservoirWater * this.outcomes.reservoirWaterUnitAssignmentsByTendays['合計'];
        //console.log('可供灌農業水資源W', this.outcomes.availableWaterForAgriculture);
    }
    //可供灌面積計算-end


    //計算每旬的基礎用水資料
    calculateBaseData() {
        this.dataFromApi.baseWaterDataByWaterGroup.forEach(waterGroupBaseData => {
            this.calculateEachRow(waterGroupBaseData);
        });
    }
    calculateEachRow(waterGroupBaseData) {
        ////console.log('await async', 'begin calculate', waterGroupBaseData);
        let fieldName;
        let prefix = this.prefix.ditchWaterNeeds;//`水門需水量_萬噸`;

        let pondCapacity = waterGroupBaseData['埤塘總庫容(m3)'] == null ? 0 : isNaN(waterGroupBaseData['埤塘總庫容(m3)']) ? 0 : waterGroupBaseData['埤塘總庫容(m3)'];

        //田間需水量打折
        let _discount = this.userSettings.fieldWaterNeedPercentage / 100;
        // console.log(`discount: ${this.userSettings.fieldWaterNeedPercentage}, ${_discount}`);
        if (_discount != 1) {
            this.tenDayPeriodList.forEach(tenDayObj => {
                waterGroupBaseData[tenDayObj.text] = waterGroupBaseData[tenDayObj.text] * _discount;
            });
        }

        //每旬水門需水量
        let total = 0;
        this.tenDayPeriodList.forEach(tenDayObj => {
            let needs = waterGroupBaseData[tenDayObj.text] / (1 - waterGroupBaseData['田間輸水損失率']);
            needs = isNaN(needs) ? 0 : needs < 0 ? 0 : needs;
            waterGroupBaseData[`${prefix}_${tenDayObj.text}`] = needs;

            fieldName = `${prefix}_${tenDayObj.text}`;
            this.baseWaterDataByWaterGroupFieldName.push(fieldName)
            total += waterGroupBaseData[fieldName];
            ////console.log('appendDitchWaterNeeds', `${prefix}_${tenDayObj.text}`, waterGroupBaseData[`${prefix}_${tenDayObj.text}`]);

        });
        fieldName = `${prefix}_合計`;
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = total;

        fieldName = `${prefix}_水門需水量(考慮旱作蓄水量)`;
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = total + (waterGroupBaseData['旱作需水量'] / (1 - waterGroupBaseData['田間輸水損失率']));

        fieldName = `${prefix}_期作支線取入量(萬噸)`;
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] =
            Math.max(waterGroupBaseData[`${prefix}_水門需水量(考慮旱作蓄水量)`] - pondCapacity * this.pondDiscountData / 10000, 0);

        fieldName = '埤塘實際用水';
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = Math.min(pondCapacity, pondCapacity / 10000 * this.pondDiscountData);


        ////console.log('埤塘總庫容(m3)', waterGroupBaseData['埤塘總庫容(m3)']);

        //埤塘每旬剩水
        let prefixRemainsEachTenDay = this.prefix.pondRemainsPerTendays;//'埤塘每旬剩水';
        this.tenDayPeriodList.forEach((tenDayObj, idx) => {

            let pondRemains = 0;
            if (idx == 0) {
                //第1旬：一期作的第1旬為二月上旬
                //埤塘總庫容(m3) / 10000 * 埤塘打折 - (當月)水門需水量(萬噸)
                pondRemains = pondCapacity / 10000 * this.pondDiscountData - waterGroupBaseData[`${prefix}_${tenDayObj.text}`];
            } else {
                //二月中後：
                //(前一旬)埤塘剩餘水量 - (當旬)水門需水量(萬噸)
                pondRemains = waterGroupBaseData[`${prefixRemainsEachTenDay}_${this.tenDayPeriodList[idx - 1].text}`] - waterGroupBaseData[`${prefix}_${tenDayObj.text}`];
            }

            fieldName = `${prefixRemainsEachTenDay}_${tenDayObj.text}`;
            this.baseWaterDataByWaterGroupFieldName.push(fieldName)
            waterGroupBaseData[fieldName] = isNaN(pondRemains) ? 0 : pondRemains < 0 ? 0 : pondRemains;

            ////console.log(prefixRemainsEachTenDay, tenDayObj.text, idx, pondRemains);
        });

        //支線取入量
        let subCanalRequirementsPrefix = this.prefix.subCanalRequirementsPrefix;//`支線取入量(先用埤塘水，用完再取支線)`;
        total = 0;
        this.tenDayPeriodList.forEach((tenDayObj, idx) => {
            let subBranchNeeds = 0;
            if (idx == 0) {
                //第1旬：一期作的第1旬為二月上旬

                //if (埤塘總庫容(m3) * 埤塘打折 / 10000 > 水門需水量)
                if (pondCapacity * this.pondDiscountData / 10000 >= waterGroupBaseData[`${prefix}_${tenDayObj.text}`]) {
                    //0
                } else {
                    //水門需水量 - 埤塘總庫容(m3) * 埤塘打折 / 10000
                    subBranchNeeds = waterGroupBaseData[`${prefix}_${tenDayObj.text}`] - pondCapacity / 10000 * this.pondDiscountData;
                }

            } else {
                //二月中後：
                //

                //if(前旬埤塘remains >= 當旬水門需水量)
                if (waterGroupBaseData[`${prefixRemainsEachTenDay}_${this.tenDayPeriodList[idx - 1].text}`] > waterGroupBaseData[`${prefix}_${tenDayObj.text}`]) {
                    //0
                } else {
                    //當旬水門需水量 - 前旬埤塘remains
                    subBranchNeeds = waterGroupBaseData[`${prefix}_${tenDayObj.text}`] - waterGroupBaseData[`${prefixRemainsEachTenDay}_${this.tenDayPeriodList[idx - 1].text}`];
                }
            }

            fieldName = `${subCanalRequirementsPrefix}_${tenDayObj.text}`;
            this.baseWaterDataByWaterGroupFieldName.push(fieldName)
            waterGroupBaseData[fieldName] = isNaN(subBranchNeeds) ? 0 : subBranchNeeds < 0 ? 0 : subBranchNeeds;
            total += waterGroupBaseData[fieldName];
            ////console.log(subCanalRequirementsPrefix, tenDayObj.text, idx, subBranchNeeds);
        });

        fieldName = `${subCanalRequirementsPrefix}_合計`;
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = total;

        //大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]
        let reservoirAssignmentPrefix = this.prefix.reservoirAssignment;
        total = 0;
        this.tenDayPeriodList.forEach((tenDayObj, idx) => {
            let assignment = 0;
            // if(田間輸水損失率 == null)
            if (waterGroupBaseData['水庫配水輸水損失率'] == null) {
                //     0 =>非水庫供水
            }
            else {
                //     支線取入量(當旬) / (1-田間輸水損失率)
                assignment = waterGroupBaseData[`${subCanalRequirementsPrefix}_${tenDayObj.text}`] / (1 - waterGroupBaseData['水庫配水輸水損失率']);
            }

            fieldName = `${reservoirAssignmentPrefix}_${tenDayObj.text}`;
            this.baseWaterDataByWaterGroupFieldName.push(fieldName)
            waterGroupBaseData[fieldName] = assignment;
            total += assignment;//waterGroupBaseData[fieldName];
            if (waterGroupBaseData['小組別'] == '第一支線三、五號池') {
                // console.log('大圳配水量SumTest', fieldName, assignment, total);
            }
        });


        fieldName = `${reservoirAssignmentPrefix}_合計`;
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = total;
        if (waterGroupBaseData['小組別'] == '第一支線三、五號池') {
            // console.log('大圳配水量SumTest-total', fieldName, total, waterGroupBaseData[fieldName]);
        }

        fieldName = '大配水合計';
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = total;


        //旱作大圳配水 = 旱作需水量 / (1 - 田間輸水損失率) / (1 - 水庫配水輸水損失率)

        fieldName = '旱作大圳配水';
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = waterGroupBaseData['旱作需水量'] / (1 - waterGroupBaseData['田間輸水損失率']) / (1 - waterGroupBaseData['水庫配水輸水損失率']);

        fieldName = '總大圳配水';
        this.baseWaterDataByWaterGroupFieldName.push(fieldName)
        waterGroupBaseData[fieldName] = total + waterGroupBaseData['旱作大圳配水'];
    }
    //計算每旬的基礎用水資料

}
export { WaterNeedsCalculator };
