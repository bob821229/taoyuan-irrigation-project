
import Enumerable from 'linq'
class AgricultureCalendar {

    tenDayPeriodBaseDataList = [{ number: 1, text: "1月上旬", days: 10 }, { number: 2, text: "1月中旬", days: 10 }, { number: 3, text: "1月下旬", days: 11 }, { number: 4, text: "2月上旬", days: 10 }, { number: 5, text: "2月中旬", days: 10 }, { number: 6, text: "2月下旬", days: 8 }, { number: 7, text: "3月上旬", days: 10 }, { number: 8, text: "3月中旬", days: 10 }, { number: 9, text: "3月下旬", days: 11 }, { number: 10, text: "4月上旬", days: 10 }, { number: 11, text: "4月中旬", days: 10 }, { number: 12, text: "4月下旬", days: 10 }, { number: 13, text: "5月上旬", days: 10 }, { number: 14, text: "5月中旬", days: 10 }, { number: 15, text: "5月下旬", days: 11 }, { number: 16, text: "6月上旬", days: 10 }, { number: 17, text: "6月中旬", days: 10 }, { number: 18, text: "6月下旬", days: 10 }, { number: 19, text: "7月上旬", days: 10 }, { number: 20, text: "7月中旬", days: 10 }, { number: 21, text: "7月下旬", days: 11 }, { number: 22, text: "8月上旬", days: 10 }, { number: 23, text: "8月中旬", days: 10 }, { number: 24, text: "8月下旬", days: 11 }, { number: 25, text: "9月上旬", days: 10 }, { number: 26, text: "9月中旬", days: 10 }, { number: 27, text: "9月下旬", days: 10 }, { number: 28, text: "10月上旬", days: 10 }, { number: 29, text: "10月中旬", days: 10 }, { number: 30, text: "10月下旬", days: 11 }, { number: 31, text: "11月上旬", days: 10 }, { number: 32, text: "11月中旬", days: 10 }, { number: 33, text: "11月下旬", days: 10 }, { number: 34, text: "12月上旬", days: 10 }, { number: 35, text: "12月中旬", days: 10 }, { number: 36, text: "12月下旬", days: 11 }];
    tenDayPeriodList = [];

    constructor() {

    }

    transferToTendaysField(list, tendaysNumberField, valueField){
        let obj = {}
        list.forEach(item => {
            let tendaysObject = Enumerable.from(this.tenDayPeriodBaseDataList).where(f => f.number == item[tendaysNumberField]).firstOrDefault();
            obj[tendaysObject.text] = item[valueField];
        })
        return obj;
    }

    getTenDaysPeriodList(
        {
            tenDaysNumberStart = null,
            tenDaysNumberEnd = null,
        } = {}
    ) {
        if (tenDaysNumberStart == null || tenDaysNumberEnd == null) {
            return this.tenDayPeriodBaseDataList;
        } else {
            let tmp = Enumerable.from(this.tenDayPeriodBaseDataList).where((obj, idx) =>
                (obj.number >= tenDaysNumberStart && obj.number <= tenDaysNumberEnd)
            ).toArray();
            return tmp;
        }
    }

    /**
     * 取得延後開灌需要計算的資料
     * @param {*} param0 
     * @returns 
     */
    getDelayToIrrigateTenDaysPeriodList(
        {
            tenDaysNumberBase = null,       //基本旬
            tendaysToStart = null,          //從第 tendaysToStart 旬開始
            tenDaysNumberEnd = null,        //整個期間在第 tenDaysNumberEnd 結束
        } = {}
    ) {
        if (tenDaysNumberBase == null || tendaysToStart == null || tenDaysNumberEnd == null) {
            return this.tenDayPeriodBaseDataList;
        } else {
            let _tendaysList = Enumerable.from(this.tenDayPeriodBaseDataList).where((obj, idx) =>
                (obj.number >= tenDaysNumberBase && obj.number <= tenDaysNumberEnd)
            ).toArray();

            let delays = tendaysToStart - tenDaysNumberBase;
            console.log(delays);
            for (let idx = 1; idx <= delays; idx++) {
                _tendaysList.pop();
            }

            return _tendaysList;
        }
        //return [];
    }

    /**
     * input format: 
    {
        "灌區": "桃三",
        "站別": "新屋",
        ...
        "2月上旬": 0.23941650574712645,
        "2月中旬": 0.3665403103448276,
        ...
    }
     * output format:  
    [
        {
            "number": 4,
            "text": "2月上旬",
            "days": 10,
            "reservoirAssignment": 0.24771093902439023
        },
        {
            "number": 5,
            "text": "2月中旬",
            "days": 10,
            "reservoirAssignment": 0.3792388658536585
        },
    ]
     * @param {*} param0 
     * @returns 
     */
    getDelayToIrrigateTenDaysPeriodDataList(
        {
            tenDaysNumberBase = null,       //基本旬
            tendaysToStart = null,          //從第 tendaysToStart 旬開始
            tenDaysNumberEnd = null,        //整個期間在第 tenDaysNumberEnd 結束

            sourceDataList = {
                "fieldWaterNeededTendaysList": {},
                "reservoirAssignedWaterTendaysList": {}
            },
            outputMappingFields = [
                {
                    "listPropertyName": "fieldWaterNeededTendaysList",
                    "outputFieldName": "fieldWaterNeeded", 
                    "outputObjectNameByDataSourceFieldName": "",
                },
                {
                    "listPropertyName": "reservoirAssignedWaterTendaysList",
                    "outputFieldName": "reservoirAssignedWater", 
                    "outputObjectNameByDataSourceFieldName": "",
                }
            ]
        } = {}
    ) {
        if (tenDaysNumberBase == null || tendaysToStart == null || tenDaysNumberEnd == null) {
            return this.tenDayPeriodBaseDataList;
        } else {
            let _tendaysList = Enumerable.from(this.tenDayPeriodBaseDataList).where((obj, idx) =>
                (obj.number >= tenDaysNumberBase && obj.number <= tenDaysNumberEnd)
            ).toArray();

            //let delays = tendaysToStart - tenDaysNumberBase;
            // console.log(delays);
            // for (let idx = 1; idx <= delays; idx++) {
            //     _tendaysList.pop();
            // }

            let outList = {};
            _tendaysList.forEach((tendaysObject) => {
                outputMappingFields.forEach(mappingItem => {
                    //console.log('sourceDataList[mappingItem.listPropertyName]', sourceDataList[mappingItem.listPropertyName]);
                    //outList[mappingItem.outputObjectName] = [];
                    sourceDataList[mappingItem.listPropertyName].forEach(dataRow => {
                        let outputObjectString = JSON.stringify(tendaysObject);
                        let outputObject = JSON.parse(outputObjectString);
                        outputObject[mappingItem.outputFieldName] = dataRow[tendaysObject.text];

                        let outputObjectKey = dataRow[mappingItem.outputObjectNameByDataSourceFieldName];
                        if(outList[outputObjectKey] == null){
                            outList[outputObjectKey] = [];
                        }
                        outList[outputObjectKey].push(outputObject); 
                    });
                });
            });
            return outList;
        }
        //return [];
    }

    // getShiftedDelayTenDaysPeriodDataList(
    //     {
    //         delay = 0,
    //         baseTendaysStart = null,
    //         baseTendaysEnd = null,
    //         sourceDataList = {
    //             "fieldWaterNeededTendaysList": [],
    //             "reservoirAssignedWaterTendaysList": []
    //         },
    //         outputMappingFields = [
    //             {
    //                 "listPropertyName": "fieldWaterNeededTendaysList",
    //                 "outputFieldName": "fieldWaterNeeded"
    //             },
    //             {
    //                 "listPropertyName": "reservoirAssignedWaterTendaysList",
    //                 "outputFieldName": "reservoirAssignedWater"
    //             }
    //         ]
    //     } = {}
    // ) {
    //     let baseTendaysList = this.getTenDaysPeriodList(
    //         {
    //             tenDaysNumberStart: baseTendaysStart,
    //             tenDaysNumberEnd: baseTendaysEnd,
    //         }
    //     );

    //     let shiftTendaysList = this.getTenDaysPeriodList(
    //         {
    //             tenDaysNumberStart: baseTendaysStart + delay,
    //             tenDaysNumberEnd: baseTendaysEnd + delay,
    //         }
    //     );

    //     sourceDataList.forEach((record) => {
    //         let tmpRecordList = [];
    //         let recordList = [];
    //         let newObj = {
    //             "站別": record["站別"]
    //         }
    //         baseTendaysList.forEach((tendaysObject, idx) => {
    //             newObj[shiftTendaysList[idx].text] = record[tendaysObject.text];
    //         });
    //         tmpRecordList.push(newObj);

    //         let newObj2 = {
    //             "站別": record["站別"]
    //         };
    //         baseTendaysList.forEach((tendaysObject, idx) => {
    //             newObj2[tendaysObject.text] = ((newObj[tendaysObject.text] == null) ? 0 : newObj[tendaysObject.text]);
    //         });
    //         recordList.push(newObj2);

    //     });

    //     return baseTendaysList;
    //     // if(tenDaysNumberBase == null || tendaysToStart == null || tenDaysNumberEnd == null){
    //     //     return this.tenDayPeriodBaseDataList;
    //     // }else{
    //     //     let _tendaysList = Enumerable.from(this.tenDayPeriodBaseDataList).where((obj, idx) => 
    //     //         (obj.number >= tenDaysNumberBase && obj.number <= tenDaysNumberEnd)
    //     //     ).toArray();

    //     //     let delays = tendaysToStart - tenDaysNumberBase;
    //     //     console.log(delays);
    //     //     for(let idx = 1; idx <= delays; idx++){
    //     //         _tendaysList.pop();
    //     //     }

    //     //     _tendaysList.forEach((tendaysObject) => {
    //     //         outputMappingFields.forEach(mappingItem => {
    //     //             sourceDataList[mappingItem.listPropertyName].forEach(dataColumn => {
    //     //                 tendaysObject[mappingItem.outputFieldName] = dataColumn[tendaysObject.text];
    //     //             });
    //     //         });
    //     //     });
    //     //     return _tendaysList;
    //     // }
    //     //return [];
    // }

}
export { AgricultureCalendar };
