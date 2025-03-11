import { ApiCaller } from './ApiCallerModule.js'
import Enumerable from '../plugins/linq.js';
class WaterGroupAndPondData {
    outcomes = [];
    baseData = [];
    constructor(_baseData) {
        console.log('WaterGroupAndPondData', _baseData);
        this.baseData = _baseData;

        this.outcomes = this.reorganizeData();
    }


    //call api - begin
    reorganizeData() {
        //只留下使用者選擇的方案工作站的埤塘
        let query = Enumerable.from(this.baseData)
            //.where(f => this.workstationFilteredArray.includes(f['站別']))
            ;

        // if (this.userSettings.step3.mapFilter.workstationPicked.length > 0) {
        //     if (this.userSettings.step3.mapFilter.workstationPicked == this.userSettings.step3.mapFilterUi.workstationPickedAll) {

        //     } else {
        //         query = query.where(f => this.userSettings.step3.mapFilter.workstationPicked.includes(f['站別']))
        //     }

        // }

        //排序
        // if (this.pondListDataSortConfigData.desc) {
        //     query = query.orderByDescending(f => f[this.pondListDataSortConfigData.field]);
        // } else {
        //     query = query.orderBy(f => f[this.pondListDataSortConfigData.field]);
        // }
        let list = query.toArray();

        list.forEach(f => {
            f["埤塘目前庫容(m3)"] = (f["埤塘目前庫容(m3)"] == null) ? 0 : f["埤塘目前庫容(m3)"];
            f["埤塘總庫容(m3)"] = (f["埤塘總庫容(m3)"] == null) ? 0 : f["埤塘總庫容(m3)"];
            f["埤塘目前庫容(萬噸)"] = f["埤塘目前庫容(m3)"] / 10000;
            f["埤塘總庫容(萬噸)"] = f["埤塘總庫容(m3)"] / 10000;

            // let list1 = Enumerable.from(this.workstationFilteredData).where(__inner => __inner.workstation == f['站別']).select(f => f.tendaysNumber).toArray();
            // f.start = ((list1.length > 0) ? list1[0] : -1);

            // //每個埤塘的 大圳配水量(萬噸) [水庫下游灌區為水庫配水量]
            // let list2 = Enumerable.from(this.compareSimulationData.baseData['大圳配水量(萬噸)  [水庫下游灌區為水庫配水量]']).where(__inner => __inner['小組別'] == f['小組別']).toArray();
            // f.fieldWaterNeedsForTendays = list2;

            // //延後開灌需要加總水量的旬別
            // let _waterNeedsAccumulationTendaysList = [];
            // if (this.userSettings.step3.tendaysPeriodForWaterNeedsAccumulation >= f.start) {
            //     _waterNeedsAccumulationTendaysList = this.getDelayToIrrigateTenDaysPeriodList(
            //         4,
            //         f.start,
            //         this.userSettings.step3.tendaysPeriodForWaterNeedsAccumulation
            //     );
            //     f.waterNeedsAccumulationTendaysList = _waterNeedsAccumulationTendaysList;
            // } else {
            //     //因為延後開灌，所以還沒開始灌
            // }


            // //計算開灌旬起到指定旬的累積 大圳配水量(萬噸) [水庫下游灌區為水庫配水量]
            // let _waterNeedsAccumulation = 0;
            // if (list2.length > 1)
            //     _waterNeedsAccumulation = -2;
            // else if (list2.length == 0)
            //     _waterNeedsAccumulation = -1;
            // else {
            //     _waterNeedsAccumulationTendaysList.forEach(f => {
            //         _waterNeedsAccumulation += list2[0][f.text]
            //     });
            // }
            // f.waterNeedsAccumulation = _waterNeedsAccumulation;

            // f.shortage = f.waterNeedsAccumulation - f["埤塘目前庫容(萬噸)"];
            // f.ifShortage = f.shortage > 0;

            // f.shortageRange =
            //     (f.shortage <= 0)
            //         ? 0
            //         : (f.shortage <= 10)
            //             ? 1
            //             : (f.shortage <= 30)
            //                 ? 2
            //                 : 3;
            f.hasPond = (f['埤塘'] != null);
        });

        return list;
    }

    getOutcome() {
        // return new Promise(
        //     (resolve) => {
        //         resolve(this.outcomes)
        //     });
        return this.outcomes;
    }
}
export { WaterGroupAndPondData };
