import { ApiCaller } from './ApiCallerModule.js'
import Enumerable from 'linq'
import axios from 'axios';
// 設定 axios 的 baseURL
if (process.env.NODE_ENV === 'production') {
    // axios.defaults.baseURL = '/projects/taoyuanIrrigation-v7/';
}
class AxiosDatabaseTables {
    outcomes = {};
    jsonPathOutcomePropertyMappings = [
        // {
        //     //path: '/irrigation-v3/irrigation-plan-water-group-field-water-need-list', property: '灌溉計畫-整田需水量', 
        //     path: './data/field-water-needs-beyond-3yrs.json', property: '判釋面積-6年內種3年',
        // },
        // { path: './data/field-water-needs-beyond-4yrs.json', property: '判釋面積-6年內種4年', },
        { property: '灌區', path: './data/bigboss-irrigation-group.json', },
        { property: '埤塘資料(一所)', path: './data/bigboss-pond-dep1-with-gis-objectid.json', },
        { property: '埤塘階層', path: './data/bigboss-pond-hierarchy.json', },
        // { property: '(湖口)埤塘HV Curve', path: '../data/bigboss-pond-hukou-pond-hv-curve', },
        { property: '工作站', path: './data/bigboss-workstation-group.json', },
        //{ property: '埤塘蓄水比率', path: './data/pond-info-summary-20241227.json', },
        //{ property: '埤塘蓄水比率', path: './data/pond-info-summary-20241230.json', },
        { property: '埤塘蓄水比率', path: './data/pond-info-summary-20250102.json', },
        { property: '埤塘數據最近更新時間', path: './data/pond-info-last-update-list.json', },
        // { property: '整田期錯開散佈圖', path: './data/irrigation-delay-all-peak-scatter-data.json', },
        { property: '整田期錯開散佈圖', path: './data/irrigation-delay-all-peak-scatter-data-in-3-tendays-period.json', },
        { property: '石門水庫歷史蓄水量', path: './data/shimen-reservoir-storage-history.json', },
        { property: '石門水庫歷史蓄水量-特定年', path: './data/shimen-reservoir-storage-history-specific-year.json', },
        // { property: 'A', path: './data/irrigation-delay-all-peak-scatter-data/桃一、桃二、桃三_種植密度5.json', },
        // { property: 'B', path: './data/irrigation-delay-all-peak-scatter-data/桃一、桃二、桃三、石一_種植密度5.json', },
        // { property: 'C', path: './data/irrigation-delay-all-peak-scatter-data/桃三、石一、石二_5年判釋平均.json', },
    ];
    constructor() {
        this.dataAccess = new ApiCaller({
            axios: axios,
            finallyCallback: function () {
                console.log("finally");
            },
        });

    }


    //call api - begin
    async loadData() {
        //console.log('await async', 'loadWaterNeedsBaseData', this.userSettings.baseDataPath);

        this.jsonPathOutcomePropertyMappings.forEach(async (item) => {
            let _axios = this.dataAccess.call(
                {
                    apiItem: {
                        uri: item.path,
                        method: 'get'
                    },
                }).then((res) => {
                    let list = res.data;
                    this.outcomes[item.property] = list;
                    //console.log(this.outcomes, list);
                });
        });

    }
    //call api - end

    getApiData(path, dataKey) {
        let _axios = this.dataAccess.call(
            {
                apiItem: {
                    uri: path,
                    method: 'get'
                },
            });
        return _axios;
            // .then((res) => {
            //     let _data = res.data;
            //     console.log(_data);
            //     //this.outcomes[dataKey] = _data;
            //     return new Promise(
            //         (resolve) => {
            //             resolve(_data)
            //         });
            // });
    }

    async getOutcome() {
        await this.loadData();
        return new Promise(
            (resolve) => {
                resolve(this.outcomes)
            });
    }
}
export { AxiosDatabaseTables };
