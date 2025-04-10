import { ref, computed, reactive, watch } from "vue";
import { defineStore } from "pinia";
import { WaterNeedsCalculator } from "@/utils/WaterNeedsCalculator";
import Enumerable from "linq";
export const useComprehensiveDataStore = defineStore(
    "comprehensiveDataStore",
    () => {
        const count = ref(0);
        const doubleCount = computed(() => count.value * 2);
        function increment() {
            count.value++;
        }
        //原始數據
        const databaseTables = ref(null);
        // 使用者設定參數
        const userSettings = ref({
            projectDataBasePath:
                "/data/water-needs-base-data/field-water-need-list-planting-roc-year-104-pond-current-storage-included-ia-20251113.json",
            ifProductionMode: false,
            step1: {
                //期作別
                farmingPeriod: 1,
                //decisionMakingDate: '02-01',//dayjs().format('MM-DD'),
                //模擬時間
                decisionMakingDate: "01-01", //dayjs().format('MM-DD'),
                perdictAt: "02-01",
                //模擬時間蓄水量
                simulationWaterStorage10kTons: 8000, //15000,
                //民生公共用水量
                publicWaterUsage10kTonsPerDay: 100,
                //安全蓄水量
                safeWaterStorage10kTons: 3400,
                //期作總入流量
                shimenReservoirInflowPredictionIndex: "I95b112",
                //可供灌水量面積
                baseDataPath: {
                    text: "民國102-103年平均種植面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-roc-year-104-pond-current-storage-included-ia-20251113.json",
                    land_using_frequency: 102103,
                },
            },
            step2: {
                //種植密度
                baseDataPath: null,
                //加強灌溉措施折扣
                fieldWaterNeedPercentage: 100,
            },
            step2_5: {
                irrigationDelaySolutionUserPicked: {},
            },
            step3: {
                tendaysPeriodForWaterNeedsAccumulation: 4,
                mapLayerColoringConfig: {
                    ifTurnOnWaterSource: false,
                    ifTurnOnRiver: true,
                    ifHighlightPond: false,
                    ifTurnOnWaterGroup: true,
                    ifTurnOnWorkstation: true,
                },
                mapGeographyColoringConfig: {
                    ifTurnOnWaterShortage: false,
                },
                mapFilter: {
                    workstationPicked: [],
                    branchPicked: [],
                    pondByBranch: null,
                    waterGroupHasNoPond: null,
                },
                mapFilterUi: {
                    workstationPickedAll: "桃三",
                },
                cardInfoBlocks: {
                    ifShowPondSummary: true,
                },
            },
            waterSourcePage: {
                irrigationGroup: null,
            },
            solutionPicker: {
                irrigationScheduleSolutionName: null, //'桃一、桃二',
            },
            //整田期錯開旬資料
            irrigationOrganizationTendaysWaterUsage: null,

            //水庫供水旬資料
            reservoirGivingTendaysWater: null,
        });
        const uiSettings = ref({
            //可供灌水量面積
            baseDataPlantingAreaPathList: [
                {
                    text: "平均5年種植水稻判釋面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-5yrs-avg-pond-current-storage-included-ia-20241227.json",
                    land_using_frequency: 0,
                },
                {
                    text: "近5年有3年以上種植水稻面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-beyond-3yrs-pond-current-storage-included-ia-20241227.json",
                    land_using_frequency: 3,
                },
                {
                    text: "近5年有4年以上種植水稻面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-beyond-4yrs-pond-current-storage-included-ia-20241227.json",
                    land_using_frequency: 4,
                },
                {
                    text: "近5年有5年以上種植水稻面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-beyond-5yrs-pond-current-storage-included-ia-20241227.json",
                    land_using_frequency: 5,
                },

                {
                    text: "民國102-103年平均種植面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-roc-year-104-pond-current-storage-included-ia-20251113.json",
                    land_using_frequency: 102103,
                },
                {
                    text: "民國105-108年平均種植面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-roc-year-105-108-avg-pond-current-storage-included-ia-20251113.json",
                    land_using_frequency: 105108,
                },
                {
                    text: "民國88-90年平均種植面積",
                    value: "/data/water-needs-base-data/field-water-need-list-planting-roc-year-88-90-avg-pond-current-storage-included-ia-20251113.json",
                    land_using_frequency: 8890,
                },
            ],
            //期作別
            farmingPeriodList: [
                {
                    text: "一期作",
                    value: 1,
                },
                // {
                //     text: '二期作',
                //     value: 2
                // },
                // {
                //     text: '全部',
                //     value: null
                // }
            ],
            // 模擬時間
            decisionMakingDateList: [
                {
                    text: "11-01",
                    value: "11-01",
                },
                {
                    text: "12-01",
                    value: "12-01",
                },
                {
                    text: "01-01",
                    value: "01-01",
                },
                {
                    text: "02-01",
                    value: "02-01",
                },
            ],
            // 超越機率入流量
            inflowsIndexList: [
                { text: "I60b112" },
                { text: "I70b112" },
                { text: "I80b112" },
                { text: "I90b112" },
                { text: "I95b112" },
                { text: "109" },
                { text: "110(百年大旱)" },
                { text: "十年最枯" },
                { text: "I60b103" },
                { text: "I70b103" },
                { text: "I80b103" },
                { text: "I85b103" },
                { text: "I95b103" },
                { text: "I60b90" },
                { text: "I70b90" },
                { text: "I80b90" },
                { text: "I90b90" },
                { text: "I95b90" },
                { text: "Q60" },
                { text: "Q70" },
                { text: "Q80" },
                { text: "Q90" },
                { text: "Q95" },
                { text: "Q95b112" },
                { text: "Q95b103" },
                { text: "Q95b90" },
            ],
            // 工作站清單
            irrigationGroupList: [
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃一",
                    workstation: "桃園工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃一",
                    workstation: "大竹工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃一",
                    workstation: "大園工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃一",
                    workstation: "大崙工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃二",
                    workstation: "草漯工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃二",
                    workstation: "新坡工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃二",
                    workstation: "觀音工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃三",
                    workstation: "新屋工作站",
                },
                {
                    association: "桃園管理處",
                    irrigationGroup: "桃三",
                    workstation: "湖口工作站",
                },
                {
                    association: "石門管理處",
                    irrigationGroup: "石一",
                    workstation: "八德工作站",
                },
                {
                    association: "石門管理處",
                    irrigationGroup: "石一",
                    workstation: "中壢工作站",
                },
                {
                    association: "石門管理處",
                    irrigationGroup: "石一",
                    workstation: "過嶺工作站",
                },
                {
                    association: "石門管理處",
                    irrigationGroup: "石二",
                    workstation: "楊梅工作站",
                },
                {
                    association: "石門管理處",
                    irrigationGroup: "石二",
                    workstation: "富岡工作站",
                },
                {
                    association: "石門管理處",
                    irrigationGroup: "石二",
                    workstation: "湖口工作站",
                },
            ],
        });
        const echartsFontSize = ref(20);
        // 種植密度對應文字
        const baseDataPathTxt = computed(() => {
            return userSettings.value.step1.baseDataPath.text;
        });
        // step1算出結果
        const simulationData = reactive({
            baseData: null, //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
            outcomes: null, //產出資料
            reservoirWaterStoarage: null, //水庫模擬
            areaWaterNeedsByIrrigationGroup: null, //各灌區需水量
        });
        // step2算出結果 (加入折扣+種植密度=>組合不同)
        const compareSimulationData = reactive({
            baseData: null, //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
            outcomes: null, //產出資料
            reservoirWaterStoarage: null, //水庫模擬
            areaWaterNeedsByIrrigationGroup: null, //各灌區需水量
        });
        //step3算出結果 (加入方案選擇 =>灌區組合不同)
        const combinationUserPickedSimulationData = reactive({
            baseData: null, //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
            outcomes: null, //產出資料
            reservoirWaterStoarage: null, //水庫模擬
            areaWaterNeedsByIrrigationGroup: null, //各灌區需水量
        });
        const reservoirWaterUnitAssignmentsByTendaysChartData = computed(() => {
            if (simulationData.outcomes == null) {
                // return {
                //     chartXAxis: {
                //         name: 'null'
                //     },
                //     chartYAxis: {
                //         name: 'null'
                //     },
                //     chartSeries: [
                //         {
                //             name: 'DD',
                //             type: 'bar',
                //             data: [100, 200, 300, 100]
                //         }
                //     ],
                // }
                return null;
            } else {
                let dataObject = copyJsonObject(
                    simulationData.outcomes
                        .reservoirWaterUnitAssignmentsByTendays
                );
                delete dataObject["合計"];
                delete dataObject.name;

                console.log(dataObject);

                let option = {
                    chartXAxis: {
                        name: "旬別",
                        data: Object.keys(dataObject),

                        position: "bottom",
                        alignTicks: true,
                        nameLocation: "middle", // 設定 x 軸名稱在中間
                        nameGap: 30, // 設定 x 軸名稱與 x 軸的垂直間距 50px
                    },
                    chartYAxis: {
                        name: "單位面積配水量(萬噸/公頃)",

                        nameLocation: "middle", // 設定 y 軸名稱在中間
                        nameGap: 60, // 設定 y 軸名稱與 y 軸的水平間距 20px
                        nameTextStyle: {
                            //align: 'center',  // 文字對齊設定
                            verticalAlign: "middle",
                        },
                        position: "left",
                    },
                    chartSeries: [
                        {
                            name: "單位面積配水量(萬噸/公頃)",
                            type: "bar",
                            data: Enumerable.from(Object.values(dataObject))
                                .select((f) => Math.round10(f, -2))
                                .toArray(), //[1, 2, 4, 5, 6, 6]
                        },
                    ],
                    // chartTitle: {
                    //     text: '各旬可供灌面積',
                    //     left: 'center'
                    // }
                };
                console.log(option);
                return option;
            }
        });
        //可供灌總配水量(萬噸)
        const plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData =
            computed(() => {
                if (simulationData.outcomes == null) {
                    // return {
                    //     chartXAxis: {
                    //         name: 'null'
                    //     },
                    //     chartYAxis: {
                    //         name: 'null'.
                    //     },
                    //     chartSeries: [
                    //         {
                    //             name: 'DD',
                    //             type: 'bar',
                    //             data: [100, 200, 300, 100]
                    //         }
                    //     ],
                    // }
                    return null;
                } else {
                    let dataObject = copyJsonObject(
                        simulationData.outcomes
                            .plantingAreaAvailableToIrrigatedByReservoirWaterByTendays
                    );
                    delete dataObject["合計"];
                    delete dataObject.name;

                    console.log(dataObject);

                    let dataList = Enumerable.from(Object.values(dataObject))
                        .select((f) =>
                            //Math.round10(f, -2)
                            Math.round(f)
                        )
                        .toArray(); //[1, 2, 4, 5, 6, 6];
                    let minValue = Enumerable.from(dataList).min();
                    dataList = Enumerable.from(dataList)
                        .select((f) => {
                            let obj = {
                                value: f,
                                itemStyle: { color: "#5D7BD9" },
                            };
                            if (f == minValue) obj.itemStyle.color = "red";
                            return obj;
                        })
                        .toArray();

                    let option = {
                        chartXAxis: {
                            name: "旬別",
                            data: Object.keys(dataObject),

                            position: "bottom",
                            alignTicks: true,
                            nameLocation: "middle", // 設定 x 軸名稱在中間
                            nameGap: 30, // 設定 x 軸名稱與 x 軸的垂直間距 50px
                        },
                        chartYAxis: {
                            name: "供灌面積(公頃)",

                            max: 35000,
                            interval: 5000, // Interval between steps
                            axisLabel: {
                                formatter(value, idx) {
                                    return `${value / 1000}k`;
                                },
                            },

                            nameLocation: "middle", // 設定 y 軸名稱在中間
                            nameGap: 60, // 設定 y 軸名稱與 y 軸的水平間距 20px
                            nameTextStyle: {
                                //align: 'center',  // 文字對齊設定
                                verticalAlign: "middle",
                            },
                            position: "left",
                        },
                        chartSeries: [
                            {
                                name: "每旬可供灌面積(公頃)",
                                type: "bar",
                                data: dataList,
                            },
                        ],
                        // chartTitle: {
                        //     text: '各旬供灌配水量',
                        //     left: 'center'
                        // }
                    };
                    console.log(option);
                    return option;
                }
            });
        // 可供灌總面積
        const minPlantingAreaAvailableToIrrigatedByReservoirWaterData =
            computed(() => {
                return simulationData.outcomes == null
                    ? 0
                    : Math.round(
                          simulationData.outcomes
                              .minPlantingAreaAvailableToIrrigatedByReservoirWater
                      );
            });
        const availableWaterForAgricultureData = computed(() => {
            return simulationData.outcomes == null
                ? 0
                : Math.round(
                      simulationData.outcomes.availableWaterForAgriculture
                  );
        });
        // 方案列表清單
        const allCombinationListData = computed(() => {
            let list = Enumerable.from(
                // //所有『可供灌』的組合
                //所有灌區組合的排名清單
                compareSimulationDataIrrigationGroupRankedList.value
            )

                .orderBy((f) => f.rank)
                .toArray();

            return list;
        });
        //所有灌區組合的排名清單
        const compareSimulationDataIrrigationGroupRankedList = computed(() => {
            return findAndRankCombinations();
        });
        //所有灌區
        const compareSimulationDataIrrigationGroupList = computed(() => {
            return compareSimulationData.areaWaterNeedsByIrrigationGroup;
        });
        //step2選擇的 種植密度方案
        const baseDataPlantingAreaPathPickedData = computed(() => {
            return userSettings.value.step2.baseDataPath;
        });
        //選擇方案
        const combinationPicked = ref(null);
        // 結構如下
        let combinationPickedObj = {
            title: "桃二、桃三",
            totalArea: 5453,
            totalWaterNeeds: 8185,
            groupList: [
                {
                    灌區: "桃二",
                    供灌面積: 1636.2847414999994,
                    供灌需水量: 2324.46128094928,
                },
                {
                    灌區: "桃三",
                    供灌面積: 3816.496665500001,
                    供灌需水量: 5860.863291176222,
                },
            ],
            rank: -4,
        };
        // 使用者選擇方案
        const solutionUserPicked = reactive({
            // 選擇地區
            irrigationCombination: null,
            delay2IrrigationCombination: null,
            baseData: {},
        });
        // 使用者選擇方案 的工作站清單
        const userPickedAssociationList = computed(() => {
            //預設為全部
            if (solutionUserPicked.irrigationCombination == null) {
                return uiSettings.value.irrigationGroupList
            } else {
                //工作站清單
                const workstationList = [];
                // 被選擇灌區清單
                let groupList = Enumerable.from(
                    solutionUserPicked.irrigationCombination.groupList
                )
                    .select((f) => f.灌區)
                    .toArray();
                groupList.forEach((group) => {
                    const matchedWorkstations = Enumerable.from(
                        uiSettings.value.irrigationGroupList
                    ).where((item) => item.irrigationGroup === group)
                        .select((item) => {return {...item}})
                        .toArray();

                        matchedWorkstations.forEach((workstation) => {
                            if (!workstationList.includes(workstation)) {
                                workstationList.push(workstation);
                            }
                        })
                        
                });
                return workstationList;
            }
        });
        watch(
            () => solutionUserPicked.irrigationCombination,
            async () => {
                if (solutionUserPicked.irrigationCombination != null) {
                    await loadDataFromCombinationUserPicked1((_baseData) => {
                        let _irrigationGroupList =
                            solutionUserPicked.irrigationCombination.groupList.map(
                                (f) => f["灌區"]
                            );
                        let _filterData = Enumerable.from(_baseData)
                            .where((f) =>
                                _irrigationGroupList.includes(f["灌區"])
                            )
                            .toArray();

                        return _filterData;
                    });
                }
            }
        );
        // 供灌模擬驗證圖(step3)
        const irragationTrendChartData = computed(() => {
            if (
                compareSimulationData.baseData == null ||
                compareSimulationData.outcomes == null ||
                compareSimulationData.reservoirWaterStoarage == null
            ) {
                return {
                    chartXAxis: {
                        name: "null",
                    },
                    chartYAxis: {
                        name: "null",
                    },
                    chartSeries: [
                        {
                            name: "DD",
                            type: "bar",
                            data: [100, 200, 300, 100],
                        },
                    ],
                    chartTitle: "sample",
                };
            } else {
                console.log(
                    "irragationTrendChartData",
                    compareSimulationData.reservoirWaterStoarage
                );
                let bbList = [],
                    publicList = [],
                    avg5List = [],
                    combinationUserPickedList = [],
                    inflowPredictionList = [];
                let s = [];
                let keyList, dataObject;

                //可供灌面積(院長)
                // console.log('可供灌面積(院長)', compareSimulationData.reservoirWaterStoarage.areaAvgBBversion)
                // keyList = Object.keys(compareSimulationData.reservoirWaterStoarage.areaAvgBBversion)
                // console.log('bb keyList', keyList);
                // dataObject = {};
                // keyList.forEach(key => {
                //     dataObject[key] = Math.round10(compareSimulationData.reservoirWaterStoarage.areaAvgBBversion[key], -2);
                // });
                // console.log('bb dataObject', dataObject);
                // bbList = Object.values(dataObject);

                // s.push(
                //     {
                //         name: '可供灌面積(院長)',
                //         type: 'line',
                //         data: bbList
                //     }
                // );

                console.log(
                    "inflow",
                    compareSimulationData.reservoirWaterStoarage
                        .inflowPrediction
                );

                //扣除民生公共用水
                console.log(
                    "扣除民生公共用水",
                    compareSimulationData.reservoirWaterStoarage
                        .publicWaterUsageDeduction
                );
                keyList = Object.keys(
                    compareSimulationData.reservoirWaterStoarage
                        .publicWaterUsageDeduction
                );
                console.log("publicList keyList", keyList);
                dataObject = {};
                keyList.forEach((key) => {
                    dataObject[key] =
                        //Math.round10(compareSimulationData.reservoirWaterStoarage.publicWaterUsageDeduction[key], -2)
                        Math.round(
                            compareSimulationData.reservoirWaterStoarage
                                .publicWaterUsageDeduction[key]
                        );
                });
                console.log("publicList dataObject", dataObject);
                publicList = Object.values(dataObject);

                s.push({
                    name: "扣除民生公共用水",
                    type: "line",
                    data: publicList,
                    lineStyle: {
                        color: "#06B050",
                        // width: 5
                    },
                    itemStyle: {
                        color: "#06B050", // Ensure the color of the points matches the line
                    },
                    showSymbol: false,
                });

                //使用者挑選的種植面積模擬線(平均五年判釋面積、6年內n年有種的面積)
                //console.log('使用者挑選的種植面積模擬線', compareSimulationData.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea)
                keyList = Object.keys(
                    compareSimulationData.reservoirWaterStoarage
                        .satelliteRecognitionAvg5YrsArea
                );
                //console.log('avg5 keyList', keyList);
                dataObject = {};
                keyList.forEach((key) => {
                    dataObject[key] =
                        //Math.round10(compareSimulationData.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[key], -2)
                        Math.round(
                            compareSimulationData.reservoirWaterStoarage
                                .satelliteRecognitionAvg5YrsArea[key]
                        );
                });
                //console.log('avg5 dataObject', dataObject);
                avg5List = Object.values(dataObject);

                // s.push(
                //     {
                //         name: '全部供灌', //userSettings.step2.baseDataPath.text,//'平均五年判釋面積',
                //         type: 'line',
                //         data: avg5List,
                //         lineStyle: {
                //             color: '#156082',
                //             //width: 5
                //         }
                //     }
                // );

                //入流量
                //compareSimulationData.reservoirWaterStoarage.includeInflowPrediction

                //使用者挑選的模擬線
                console.log(
                    "使用者挑選的模擬線",
                    compareSimulationData.reservoirWaterStoarage,
                    solutionUserPicked.irrigationCombination
                );
                if (
                    combinationUserPickedSimulationData.reservoirWaterStoarage !=
                        null &&
                    solutionUserPicked.irrigationCombination != null
                ) {
                    //console.log('使用者挑選的模擬線', combinationUserPickedSimulationData.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea)
                    keyList = Object.keys(
                        combinationUserPickedSimulationData
                            .reservoirWaterStoarage
                            .satelliteRecognitionAvg5YrsArea
                    );
                    //console.log('avg5 keyList', keyList);
                    dataObject = {};
                    keyList.forEach((key) => {
                        dataObject[key] =
                            //Math.round10(combinationUserPickedSimulationData.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[key], -2)
                            Math.round(
                                combinationUserPickedSimulationData
                                    .reservoirWaterStoarage
                                    .satelliteRecognitionAvg5YrsArea[key]
                            );
                    });
                    //console.log('avg5 dataObject', dataObject);
                    combinationUserPickedList = Object.values(dataObject);

                    s.push({
                        name: solutionUserPicked.irrigationCombination.groupList
                            .map((f) => f["灌區"])
                            .join(", "), //'只供灌使用者挑選的灌區',//'平均五年判釋面積',
                        type: "line",
                        data: combinationUserPickedList,
                        lineStyle: {
                            color: "#FFBF00",
                            //width: 5
                        },
                        itemStyle: {
                            color: "#FFBF00", // Ensure the color of the points matches the line
                        },
                        showSymbol: false,
                    });

                    // //if(combinationUserPickedSimulationData.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion.length > 0){

                    //     keyList = Object.keys(combinationUserPickedSimulationData.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion)
                    //     //console.log('avg5 keyList', keyList);
                    //     dataObject = {};
                    //     keyList.forEach(key => {
                    //         dataObject[key] =
                    //             //Math.round10(combinationUserPickedSimulationData.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[key], -2)
                    //             Math.round(combinationUserPickedSimulationData.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion[key])
                    //             ;
                    //     });
                    //     //console.log('avg5 dataObject', dataObject);
                    //     combinationUserPickedList = Object.values(dataObject);

                    //     s.push(
                    //         {
                    //             name: '整田期錯開', //'只供灌使用者挑選的灌區',//'平均五年判釋面積',
                    //             type: 'line',
                    //             data: combinationUserPickedList,
                    //             lineStyle: {
                    //                 color: 'black',
                    //                 //width: 5
                    //             }
                    //         }
                    //     );
                    // //}

                    // //if(combinationUserPickedSimulationData.reservoirWaterStoarage.afterWaterGivingSimulation.length > 0){

                    //     keyList = Object.keys(combinationUserPickedSimulationData.reservoirWaterStoarage.afterWaterGivingSimulation)
                    //     //console.log('avg5 keyList', keyList);
                    //     dataObject = {};
                    //     keyList.forEach(key => {
                    //         dataObject[key] =
                    //             //Math.round10(combinationUserPickedSimulationData.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea[key], -2)
                    //             Math.round(combinationUserPickedSimulationData.reservoirWaterStoarage.afterWaterGivingSimulation[key])
                    //             ;
                    //     });
                    //     //console.log('avg5 dataObject', dataObject);
                    //     combinationUserPickedList = Object.values(dataObject);

                    //     s.push(
                    //         {
                    //             name: '聯合運用埤塘', //先用埤塘的用水方式
                    //             type: 'line',
                    //             data: combinationUserPickedList,
                    //             lineStyle: {
                    //                 color: 'red',
                    //                 //width: 5
                    //             }
                    //         }
                    //     );
                    // //}
                }

                //安全蓄水量
                let xAxisData = Object.keys(
                    compareSimulationData.reservoirWaterStoarage
                        .publicWaterUsageDeduction
                );
                let safeWaterStorageList = [];
                avg5List.forEach(() => {
                    safeWaterStorageList.push(
                        userSettings.value.step1.safeWaterStorage10kTons
                    );
                });
                s.push({
                    name: "安全蓄水量",
                    type: "line",
                    data: safeWaterStorageList,
                    lineStyle: {
                        color: "#FF0000",
                        // width: 5
                    },
                    itemStyle: {
                        color: "#FF0000", // Ensure the color of the points matches the line
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.1,
                    },
                });

                //設定chart option
                let option = {
                    chartXAxis: {
                        name: "旬別",
                        data: xAxisData, //Object.keys(dataObject),

                        position: "bottom",
                        alignTicks: true,
                        nameLocation: "middle", // 設定 x 軸名稱在中間
                        nameGap: 30, // 設定 x 軸名稱與 x 軸的垂直間距 50px
                    },
                    chartYAxis: {
                        name: "石門水庫蓄水量(萬噸)",

                        nameLocation: "middle", // 設定 y 軸名稱在中間
                        nameGap: 60, // 設定 y 軸名稱與 y 軸的水平間距 20px
                        nameTextStyle: {
                            //align: 'center',  // 文字對齊設定
                            verticalAlign: "middle",
                        },
                        position: "left",

                        max: 25000,
                    },
                    chartSeries: s,
                    // [
                    //     {
                    //         //name: '水庫配水量(萬噸)',
                    //         type: 'line',
                    //         data: Object.values(dataObject)//[1, 2, 4, 5, 6, 6]
                    //     }
                    // ],
                    chartTitle: null,
                    // {
                    //     text: '各旬可供灌面積',
                    //     left: 'center'
                    // }
                };

                return option;
            }
        });
        // ============ step4 ============
        // 選擇整田期錯開方案
        // solutionUserPicked.delay2IrrigationCombination
        const comboPicked = ref(null);
        // 配水量
        const comboPickedChartOption = computed(() => {
            if (comboPicked.value == null) return null;

            let xAxisData = comboPicked.value.tendaysWaterUsageList.map(
                (f) => f.tendaysNumber
            );
            let series = comboPicked.value.tendaysWaterUsageList.map(
                (f) => f.waterUsage
            );
            let maxX = Enumerable.from(series).max((f) => f) + 100;
            let chartSeries = [];
            chartSeries.push({
                name: "配水量",
                type: "bar",
                data: series,
                itemStyle: {
                    color: "#E97132",
                },
                // lineStyle: {
                //     color: "#E97132",
                // },
            });

            let option = {
                chartXAxis: {
                    name: "旬別",
                    data: xAxisData, //Object.keys(dataObject),

                    position: "bottom",
                    alignTicks: true,
                    nameLocation: "middle", // 設定 x 軸名稱在中間
                    nameGap: 30, // 設定 x 軸名稱與 x 軸的垂直間距 50px
                },
                chartYAxis: {
                    name: "石門水庫配水量(萬噸)",

                    nameLocation: "middle", // 設定 y 軸名稱在中間
                    nameGap: 60, // 設定 y 軸名稱與 y 軸的水平間距 20px
                    nameTextStyle: {
                        //align: 'center',  // 文字對齊設定
                        verticalAlign: "middle",
                    },
                    position: "left",

                    max: maxX,
                },
                chartSeries: chartSeries,
                chartTitle: null,
            };
            return option;
        });
        // 整田期錯開後 計算結果
        const simulationDataHere = ref({
            baseData: null,
            outcomes: null,
            reservoirWaterStoarage: null,
            areaWaterNeedsByIrrigationGroup: null,
        });
        // 整田期錯開後 計算結果轉成echarts資料格式
        const irragationTrendChartData2 = computed(() => {
            if (
                simulationDataHere.value.baseData == null ||
                simulationDataHere.value.outcomes == null ||
                simulationDataHere.value.reservoirWaterStoarage == null
            ) {
                return {
                    chartXAxis: {
                        name: "null",
                    },
                    chartYAxis: {
                        name: "null",
                    },
                    chartSeries: [
                        {
                            name: "DD",
                            type: "bar",
                            data: [100, 200, 300, 100],
                        },
                    ],
                    //chartTitle: 'sample'
                };
            } else {
                console.log(
                    "irragationTrendChartData",
                    simulationDataHere.value.reservoirWaterStoarage
                );
                let publicList = [],
                    avg5List = [],
                    combinationUserPickedList = [];
                let s = [];
                let keyList, dataObject;

                //扣除民生公共用水
                console.log(
                    "扣除民生公共用水",
                    simulationDataHere.value.reservoirWaterStoarage
                        .publicWaterUsageDeduction
                );
                keyList = Object.keys(
                    simulationDataHere.value.reservoirWaterStoarage
                        .publicWaterUsageDeduction
                );
                console.log("publicList keyList", keyList);
                dataObject = {};
                keyList.forEach((key) => {
                    dataObject[key] = Math.round(
                        simulationDataHere.value.reservoirWaterStoarage
                            .publicWaterUsageDeduction[key]
                    );
                });
                console.log("publicList dataObject", dataObject);
                publicList = Object.values(dataObject);

                s.push({
                    name: "扣除民生公共用水",
                    type: "line",
                    data: publicList,
                    lineStyle: {
                        color: "#06B050",
                        // width: 5
                    },
                    itemStyle: {
                        color: "#06B050", // Ensure the color of the points matches the line
                    },
                    showSymbol: false,
                });

                //使用者挑選的種植面積模擬線(平均五年判釋面積、6年內n年有種的面積)
                //console.log('使用者挑選的種植面積模擬線', simulationDataHere.value.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea)
                keyList = Object.keys(
                    simulationDataHere.value.reservoirWaterStoarage
                        .satelliteRecognitionAvg5YrsArea
                );
                //console.log('avg5 keyList', keyList);
                dataObject = {};
                keyList.forEach((key) => {
                    dataObject[key] = Math.round(
                        simulationDataHere.value.reservoirWaterStoarage
                            .satelliteRecognitionAvg5YrsArea[key]
                    );
                });
                //console.log('avg5 dataObject', dataObject);
                avg5List = Object.values(dataObject);

                // s.push(
                //     {
                //         name: '全部供灌', //this.userSettings.step2.baseDataPath.text,//'平均五年判釋面積',
                //         type: 'line',
                //         data: avg5List,
                //         lineStyle: {
                //             color: '#156082',
                //             //width: 5
                //         }
                //     }
                // );

                //入流量
                //this.compareSimulationData.reservoirWaterStoarage.includeInflowPrediction

                //使用者挑選的模擬線
                console.log(
                    "使用者挑選的模擬線",
                    simulationDataHere.value.reservoirWaterStoarage
                );
                if (simulationDataHere.value.reservoirWaterStoarage != null) {
                    //console.log('使用者挑選的模擬線', simulationDataHere.value.reservoirWaterStoarage.satelliteRecognitionAvg5YrsArea)
                    keyList = Object.keys(
                        simulationDataHere.value.reservoirWaterStoarage
                            .satelliteRecognitionAvg5YrsArea
                    );
                    //console.log('avg5 keyList', keyList);
                    dataObject = {};
                    keyList.forEach((key) => {
                        dataObject[key] = Math.round(
                            simulationDataHere.value.reservoirWaterStoarage
                                .satelliteRecognitionAvg5YrsArea[key]
                        );
                    });
                    //console.log('avg5 dataObject', dataObject);
                    combinationUserPickedList = Object.values(dataObject);

                    s.push({
                        name: "方案",
                        type: "line",
                        data: combinationUserPickedList,
                        lineStyle: {
                            color: "#FFBF00",
                            //width: 5
                        },
                        itemStyle: {
                            color: "#FFBF00",
                        },
                        showSymbol: false,
                    });

                    //if(simulationDataHere.value.reservoirWaterStoarage.afterIrrigationScheduleOrganiztion.length > 0){

                    keyList = Object.keys(
                        simulationDataHere.value.reservoirWaterStoarage
                            .afterIrrigationScheduleOrganiztion
                    );
                    //console.log('avg5 keyList', keyList);
                    dataObject = {};
                    keyList.forEach((key) => {
                        dataObject[key] = Math.round(
                            simulationDataHere.value.reservoirWaterStoarage
                                .afterIrrigationScheduleOrganiztion[key]
                        );
                    });
                    //console.log('avg5 dataObject', dataObject);
                    combinationUserPickedList = Object.values(dataObject);

                    s.push({
                        name: "整田錯開", //'只供灌使用者挑選的灌區',//'平均五年判釋面積',
                        type: "line",
                        data: combinationUserPickedList,
                        lineStyle: {
                            color: "#E97132",
                            //width: 5
                            type: "dashed",
                        },
                        itemStyle: {
                            color: "#E97132", // Ensure the color of the points matches the line
                        },
                        showSymbol: false,
                    });
                    //}
                }

                //安全蓄水量
                let xAxisData = Object.keys(
                    simulationDataHere.value.reservoirWaterStoarage
                        .publicWaterUsageDeduction
                );
                let safeWaterStorageList = [];
                avg5List.forEach(() => {
                    safeWaterStorageList.push(
                        userSettings.value.step1.safeWaterStorage10kTons
                    );
                });
                s.push({
                    name: "安全蓄水量",
                    type: "line",
                    data: safeWaterStorageList,
                    lineStyle: {
                        color: "#FF0000",
                        // width: 5
                    },
                    itemStyle: {
                        color: "#FF0000", // Ensure the color of the points matches the line
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.1,
                    },
                });

                //設定chart option
                let option = {
                    chartXAxis: {
                        name: "旬別",
                        data: xAxisData, //Object.keys(dataObject),

                        position: "bottom",
                        alignTicks: true,
                        nameLocation: "middle", // 設定 x 軸名稱在中間
                        nameGap: 30, // 設定 x 軸名稱與 x 軸的垂直間距 50px
                    },
                    chartYAxis: {
                        name: "石門水庫蓄水量(萬噸)",

                        nameLocation: "middle", // 設定 y 軸名稱在中間
                        nameGap: 60, // 設定 y 軸名稱與 y 軸的水平間距 20px
                        nameTextStyle: {
                            //align: 'center',  // 文字對齊設定
                            verticalAlign: "middle",
                        },
                        position: "left",

                        max: 25000,
                    },
                    chartSeries: s,
                    // [
                    //     {
                    //         //name: '水庫配水量(萬噸)',
                    //         type: 'line',
                    //         data: Object.values(dataObject)//[1, 2, 4, 5, 6, 6]
                    //     }
                    // ],
                    chartTitle: null,
                    // {
                    //     text: '各旬可供灌面積',
                    //     left: 'center'
                    // }
                };
                //console.log(option);

                console.log(
                    "irragationTrendChartData return",
                    simulationDataHere.value.reservoirWaterStoarage,
                    s,
                    option
                );

                return option;
            }
        });
        // =================以下為函式=================
        //深拷貝
        function copyJsonObject(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        //先把所有灌區建立組合
        //再用限制排序(rank)符合的組合(正名次)與不符合的組合(負名次)
        function findAndRankCombinations() {
            console.log("findAndRankCombinations!!!");
            let groups = compareSimulationDataIrrigationGroupList.value;
            console.log("groups@@:", groups);
            const results = [];
            if (groups == null) return results;

            function backtrack(start, combination, totalArea, totalWNeeds) {
                if (combination.length > 0) {
                    // Add the current combination to results
                    let tmpTitleList = combination.map((g) => {
                        let obj = {
                            灌區: g["灌區"],
                            order: getIrrigationGroupSeq(g["灌區"]),
                            // g['灌區'] == '桃一' ? 1
                            //     : g['灌區'] == '桃二' ? 2
                            //     : g['灌區'] == '桃三' ? 3
                            //     : g['灌區'] == '石一' ? 4
                            //     : 5
                        };
                        return obj;
                    });
                    let titleList = Enumerable.from(tmpTitleList)
                        .orderBy((f) => f.order)
                        .select((f) => f["灌區"])
                        .toArray();
                    results.push({
                        title: titleList.join("、"),
                        totalArea: Math.round(totalArea),
                        totalWaterNeeds: Math.round(totalWNeeds),
                        groupList: [...combination],
                    });
                }

                for (let i = start; i < groups.length; i++) {
                    const group = groups[i];
                    backtrack(
                        i + 1,
                        [...combination, group], // Add group to the combination
                        totalArea + group["供灌面積"], // Update total area
                        totalWNeeds + group["供灌需水量"] // Update total wNeeds
                    );
                }
            }

            backtrack(0, [], 0, 0);
            //return results;

            //ranking
            let maxValues = {
                maxArea:
                    minPlantingAreaAvailableToIrrigatedByReservoirWaterData.value,
                maxWNeeds: availableWaterForAgricultureData.value,
            };
            console.log("@@maxValues:", maxValues);
            let r2 = Enumerable.from(results)
                .where(
                    (f) =>
                        //(f.title.indexOf('桃一') >= 0 && f.title.indexOf('桃二') >= 0) &&
                        !(
                            f.title.indexOf("桃一") >= 0 &&
                            f.title.indexOf("桃二") < 0
                        )
                )
                .toArray();
            // let r2 =  results;

            let validList = Enumerable.from(r2)
                .where(
                    (
                        f //f.totalArea <= maxValues.maxArea &&
                    ) => f.totalWaterNeeds <= maxValues.maxWNeeds
                )
                .orderByDescending((f) => f.totalWaterNeeds)
                .select((group, idx) => {
                    group.rank = idx + 1;
                    return group;
                })
                .toArray();

            let invalidList = Enumerable.from(r2)
                .where(
                    (
                        f //f.totalArea > maxValues.maxArea ||
                    ) => f.totalWaterNeeds > maxValues.maxWNeeds
                )
                .orderBy((f) => f.totalWaterNeeds)
                .select((group, idx) => {
                    group.rank = -(idx + 1);
                    return group;
                })
                .toArray();
            console.log("validList:@@", validList);
            console.log("invalidList:@@", invalidList);
            return [...validList, ...invalidList];
        }
        //找出所有符合供灌水量的組合
        function findAvailableCombinations() {
            let groups = compareSimulationDataIrrigationGroupList;
            const results = [];
            if (groups == null) return results;
            let maxValues = {
                maxArea:
                    minPlantingAreaAvailableToIrrigatedByReservoirWaterData,
                maxWNeeds: availableWaterForAgricultureData,
            };
            console.log(maxValues, groups);

            function backtrack(start, combination, totalArea, totalWNeeds) {
                if (
                    totalArea > 0 &&
                    totalWNeeds > 0 &&
                    totalArea <= maxValues.maxArea &&
                    totalWNeeds <= maxValues.maxWNeeds
                ) {
                    let title = [...combination]
                        .map((f) => f["灌區"])
                        .join("、");
                    let combinationObject = {
                        title: title,
                        totalArea: Math.round(totalArea),
                        totalWaterNeeds: Math.round(totalWNeeds),
                        groupList: [...combination],
                    };
                    results.push(combinationObject);
                }

                for (let i = start; i < groups.length; i++) {
                    const group = groups[i];
                    const newArea = totalArea + group["供灌面積"];
                    const newWNeeds = totalWNeeds + group["供灌需水量"];

                    if (
                        newArea <= maxValues.maxArea &&
                        newWNeeds <= maxValues.maxWNeeds
                    ) {
                        combination.push(group);
                        backtrack(i + 1, combination, newArea, newWNeeds);
                        combination.pop(); // Backtrack
                    }
                }
            }

            backtrack(0, [], 0, 0);
            return results;
        }
        async function loadDataFromCombinationUserPicked1(
            baseDataFilterCallback
        ) {
            let _waterNeedsCalculator = new WaterNeedsCalculator();

            let c = await loadDataFromCombinationUserPicked(
                _waterNeedsCalculator,
                userSettings.value,
                baseDataFilterCallback
            );
            combinationUserPickedSimulationData.baseData = c.baseData; //基礎資料及運用基礎資料計算出的中繼結果(中繼結果是用來再計算以算出outcomes)
            combinationUserPickedSimulationData.outcomes = c.outcomes;
            combinationUserPickedSimulationData.reservoirWaterStoarage =
                c.reservoirWaterStoarage;
            combinationUserPickedSimulationData.areaWaterNeedsByIrrigationGroup =
                c.areaWaterNeedsByIrrigationGroup;
        }
        return {
            count,
            doubleCount,
            increment,
            userSettings,
            uiSettings,
            simulationData,
            reservoirWaterUnitAssignmentsByTendaysChartData,
            plantingAreaAvailableToIrrigatedByReservoirWaterByTendaysChartData,
            minPlantingAreaAvailableToIrrigatedByReservoirWaterData,
            availableWaterForAgricultureData,
            baseDataPathTxt,
            allCombinationListData,
            compareSimulationData,
            baseDataPlantingAreaPathPickedData,
            solutionUserPicked,
            databaseTables,
            combinationUserPickedSimulationData,
            comboPicked,
            simulationDataHere,
            irragationTrendChartData,
            irragationTrendChartData2,
            comboPickedChartOption,
            userPickedAssociationList,
            echartsFontSize
        };
    }
);
