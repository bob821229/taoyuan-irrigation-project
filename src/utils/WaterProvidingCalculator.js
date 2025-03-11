import { ApiCaller } from './ApiCallerModule.js';
import axios from 'axios';
import Enumerable from 'linq'
class WaterProvidingCalculator {

    userSettings = {
    }

    constructor() {
        this.dataAccess = new ApiCaller({
            axios: axios,
            finallyCallback: function () {
                console.log("finally");
            },
        });
        
    }

    async loadData() {
        //console.log('await async', 'loadWaterNeedsBaseData', this.userSettings.baseDataPath);

        // let _baseData = await this.dataAccess.getData(
        //     {
        //         //path: '/irrigation-v3/workstation-delay-irrigation-plan-list'
        //         path: '/irrigation-v3/workstation-delay-irrigation-plan-list-by-order'
        //     }
        // );
        // this.baseData = _baseData;
        let x = await this.dataAccess.callAsync({
            apiItem: {
                uri: './data/water-needs-base-data/workstation-delay-irrigation-plan-list-by-order-20250115.json',
                method: 'get'
            },
        }).then((res) => {
                let _data = res.data;
                this.baseData = _data;  
        });
    }

    baseData = [];
    outcomes = {
        // combinationList: [
        //     {
        //         solutionName: '桃一',
        //         rank: 1,
        //         workstationProvidingStartList: [
        //             { workstation: "桃園工作站", tendaysNumber: 4},
        //             { workstation: "大竹工作站", tendaysNumber: 4},
        //             { workstation: "大園工作站", tendaysNumber: 5},
        //             { workstation: "大崙工作站", tendaysNumber: 4},
        //             { workstation: "草漯工作站", tendaysNumber: 7},
        //             { workstation: "新坡工作站", tendaysNumber: 4},
        //             { workstation: "觀音工作站", tendaysNumber: 6},
        //             { workstation: "新屋工作站", tendaysNumber: 4},
        //             { workstation: "湖口工作站", tendaysNumber: 5}
        //         ],
        //         tendaysWaterUsageList: [
        //             { tendaysNumber: 4, usage: 19.42 },
        //             { tendaysNumber: 5, waterUsage: 29.73052109 },
        //             { tendaysNumber: 6, waterUsage: 72.741493 },
        //             { tendaysNumber: 7, waterUsage: 396.1684039 },
        //             { tendaysNumber: 8, waterUsage: 541.6429531 },
        //             { tendaysNumber: 9, waterUsage: 540.8121922 },
        //             { tendaysNumber: 10, waterUsage: 540.9046035 },
        //             { tendaysNumber: 11, waterUsage: 607.2758058 },
        //             { tendaysNumber: 12, waterUsage: 549.875387 },
        //             { tendaysNumber: 13, waterUsage: 459.0823616 },
        //             { tendaysNumber: 14, waterUsage: 459.0823616 },
        //             { tendaysNumber: 15, waterUsage: 504.5308415 },
        //             { tendaysNumber: 16, waterUsage: 432.2258035 },
        //             { tendaysNumber: 17, waterUsage: 432.2258035 },
        //             { tendaysNumber: 18, waterUsage: 460.25819 },
        //             { tendaysNumber: 19, waterUsage: 356.0056709 },
        //             { tendaysNumber: 20, waterUsage: 238.7439285 },
        //             { tendaysNumber: 21, waterUsage: 146.2544367 },
        //             { tendaysNumber: 22, waterUsage: 102.9128712 },
        //             { tendaysNumber: 23, waterUsage: 47.28 },
        //             { tendaysNumber: 24, waterUsage: 3.671486214 }

        //         ],
        //         waterUsagePeak: 692.817,
        //         waterUsageSummaryAfterTendays16: 3337.8
        //     }
        // ]
        combinationList: [],
    }

    //getter-begin
    async getOutcomes(queryObject) {
        console.log('WaterProvidingCalculator getOutcomes', queryObject, this.baseData);
        this.outcomes.combinationList =
            Enumerable.from(this.baseData)
                .where(
                    f => f.plantingYear == queryObject.plantingYear && f.solutionName == queryObject.solutionName
                )
                .select(
                    f => {
                        let obj = f;
                        obj.workstationProvidingStartList.forEach(item => {
                            item.association = 
                                ( item.irrigationGroup == '桃一' && `${item.workstation}工作站` == '桃園工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃一' && `${item.workstation}工作站` == '大竹工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃一' && `${item.workstation}工作站` == '大園工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃一' && `${item.workstation}工作站` == '大崙工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃二' && `${item.workstation}工作站` == '草漯工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃二' && `${item.workstation}工作站` == '新坡工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃二' && `${item.workstation}工作站` == '觀音工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃三' && `${item.workstation}工作站` == '新屋工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '桃三' && `${item.workstation}工作站` == '湖口工作站') ? '桃園管理處' :
                                ( item.irrigationGroup == '石一' && `${item.workstation}工作站` == '八德工作站') ? '石門管理處' :
                                ( item.irrigationGroup == '石一' && `${item.workstation}工作站` == '中壢工作站') ? '石門管理處' :
                                ( item.irrigationGroup == '石一' && `${item.workstation}工作站` == '過嶺工作站') ? '石門管理處' :
                                ( item.irrigationGroup == '石二' && `${item.workstation}工作站` == '楊梅工作站') ? '石門管理處' :
                                ( item.irrigationGroup == '石二' && `${item.workstation}工作站` == '富岡工作站') ? '石門管理處' :
                                ( item.irrigationGroup == '石二' && `${item.workstation}工作站` == '湖口工作站') ? '石門管理處' :
                                null;
                        });
                        return obj;
                    }
                )
                .orderBy(f => f.rank)
                .toArray();
        // let q = Enumerable.from(this.baseData);
        // if(queryObject.)
        console.log(this.outcomes.combinationList);

        return new Promise(
            (resolve) => {
                resolve(this.outcomes)
            });
    }

    async calculate() {

    }
    // ramdonOutcome(allCombinationList) {
    //     let solutionList = allCombinationList.map(f => f.title);

    //     console.log('ramdonOutcome', solutionList, solutionList.length);

    //     this.outcomes.combinationList.length = 0;
    //     solutionList.forEach(_solutionName => {
    //         for (let rnk = 1; rnk <= 3; rnk++) {
    //             let obj = {
    //                 solutionName: _solutionName,
    //                 rank: rnk,
    //                 workstationProvidingStartList: [
    //                     { workstation: "桃園工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "大竹工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "大園工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "大崙工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "草漯工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "新坡工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "觀音工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "新屋工作站", tendaysNumber: getRandomNumber(4, 8) },
    //                     { workstation: "湖口工作站", tendaysNumber: getRandomNumber(4, 8) }
    //                 ],
    //                 tendaysWaterUsageList: [
    //                     { tendaysNumber: 4, usage: getRandomNumber(1, 2) * 19.42 },
    //                     { tendaysNumber: 5, waterUsage: getRandomNumber(1, 2) * 29.73052109 },
    //                     { tendaysNumber: 6, waterUsage: getRandomNumber(1, 2) * 72.741493 },
    //                     { tendaysNumber: 7, waterUsage: getRandomNumber(1, 2) * 396.1684039 },
    //                     { tendaysNumber: 8, waterUsage: getRandomNumber(1, 2) * 541.6429531 },
    //                     { tendaysNumber: 9, waterUsage: getRandomNumber(1, 2) * 540.8121922 },
    //                     { tendaysNumber: 10, waterUsage: getRandomNumber(1, 2) * 540.9046035 },
    //                     { tendaysNumber: 11, waterUsage: getRandomNumber(1, 2) * 607.2758058 },
    //                     { tendaysNumber: 12, waterUsage: getRandomNumber(1, 2) * 549.875387 },
    //                     { tendaysNumber: 13, waterUsage: getRandomNumber(1, 2) * 459.0823616 },
    //                     { tendaysNumber: 14, waterUsage: getRandomNumber(1, 2) * 459.0823616 },
    //                     { tendaysNumber: 15, waterUsage: getRandomNumber(1, 2) * 504.5308415 },
    //                     { tendaysNumber: 16, waterUsage: getRandomNumber(1, 2) * 432.2258035 },
    //                     { tendaysNumber: 17, waterUsage: getRandomNumber(1, 2) * 432.2258035 },
    //                     { tendaysNumber: 18, waterUsage: getRandomNumber(1, 2) * 460.25819 },
    //                     { tendaysNumber: 19, waterUsage: getRandomNumber(1, 2) * 356.0056709 },
    //                     { tendaysNumber: 20, waterUsage: getRandomNumber(1, 2) * 238.7439285 },
    //                     { tendaysNumber: 21, waterUsage: getRandomNumber(1, 2) * 146.2544367 },
    //                     { tendaysNumber: 22, waterUsage: getRandomNumber(1, 2) * 102.9128712 },
    //                     { tendaysNumber: 23, waterUsage: getRandomNumber(1, 2) * 47.28 },
    //                     { tendaysNumber: 24, waterUsage: getRandomNumber(1, 2) * 3.671486214 }
    //                 ],
    //                 waterUsagePeak: getRandomNumber(600, 700),
    //                 waterUsageSummaryAfterTendays16: getRandomNumber(2000, 3500)
    //             };
    //             this.outcomes.combinationList.push(obj);
    //         }

    //     });

    //     console.log('ramdonOutcome2', this.outcomes.combinationList, this.outcomes.combinationList.length);

    //     //this.outcomes.combinationList = solutionList;
    // }

}
export { WaterProvidingCalculator };
