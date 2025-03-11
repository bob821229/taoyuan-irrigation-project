import Enumerable from 'linq'
class WaterGivingByReservoirCalculator {

    userSettings = {
        tendaysNumberStartToGiveWater: 5
    }
    outcomes = {
        tendaysStaticsList: [],
    };

    constructor() {
    }
    // async loadData() {
    //     //console.log('await async', 'loadWaterNeedsBaseData', this.userSettings.baseDataPath);
    //     let _baseData = await this.dataAccess.getData(
    //         {
    //             path: '/irrigation-v3/workstation-delay-irrigation-plan-list'
    //         }
    //     );
    //     this.baseData = _baseData;
    // }
    //getter-begin
    async getOutcomes(queryObject) {


        return new Promise(
            (resolve) => {
                resolve(this.outcomes)
            });
    }

    async calculate(tendaysWaterUsageList, currentPondStorage, totalPondStorage) {
        //currentPondStorage: 第1期的蓄水量
        //totalPondStorage: 總蓄水量
        let initPondStorage = currentPondStorage;

        let peakWaterUsage = Enumerable.from(tendaysWaterUsageList).max(f => f['waterUsage']);
        let peakWaterUsageTendays = Enumerable.from(tendaysWaterUsageList).where(f => f['waterUsage'] == peakWaterUsage).toArray()[0];

        console.log('peakWaterUsage', peakWaterUsage, peakWaterUsageTendays);

        let list = Enumerable.from(tendaysWaterUsageList).select(
            (item, idx) => {
                if (idx == 0) {
                    //埤塘要補滿：埤唐不足 + 大配水量
                    item.reservoirGiving = totalPondStorage - currentPondStorage;
                    //所以埤塘會滿
                    item.currentPondRemain = totalPondStorage;
                } else {
                    if (item.tendaysNumber == peakWaterUsageTendays) {
                        //水庫給水原則：用掉的水 - 期初埤塘量 x 2/3 (因為實)
                        item.reservoirGiving = item.waterUsage - currentPondStorage * (2 / 3);
                        //埤塘蓄水量：沒有進水，但用掉2/3，所以只剩下1/3
                        item.currentPondRemain = currentPondStorage * 1 / 3;
                    } else if (item.tendaysNumber == peakWaterUsageTendays + 1) {
                        //水庫給水原則：用掉的水 - 期初埤塘量 x 1/3 (因為把埤塘在 peakWaterUsageTendays 剩下的1/3用掉)
                        item.reservoirGiving = item.waterUsage - currentPondStorage * 1 / 3;
                        //埤塘蓄水量：沒有進水，但把 peakWaterUsageTendays 剩下的1/3用掉
                        item.currentPondRemain = 0;
                    } else if (item.tendaysNumber == peakWaterUsageTendays + 2) {
                        //尖峰 + 2：開始補埤塘水
                        //水庫給水： 用掉的量 + 埤塘補回總量的 1/3 [第1次補]
                        item.reservoirGiving = item.waterUsage + totalPondStorage * 1 / 3;
                        //埤塘蓄水量：埤塘補回總量的 1/3
                        item.currentPondRemain = totalPondStorage * 1 / 3;
                    } else if (item.tendaysNumber == peakWaterUsageTendays + 3) {
                        //尖峰 + 3：補埤塘水
                        //水庫給水： 用掉的量 + 埤塘補回總量的 2/3 [第1次補]
                        item.reservoirGiving = item.waterUsage - currentPondStorage * 2 / 3;
                        //埤塘蓄水量：埤塘補回總量的 2/3 => 補到滿
                        item.currentPondRemain = totalPondStorage;
                    }

                    else {
                        //正常狀況

                        if (currentPondStorage >= item.waterUsage) {
                            //如果埤塘還有水 => 大圳不給水
                            item.reservoirGiving = 0;
                            item.currentPondRemain = currentPondStorage - item.waterUsage;
                        }
                        else {
                            //如果埤塘水不夠 => 大圳給水：此旬要用掉的水 + 補滿埤塘的水
                            item.reservoirGiving = item.waterUsage + totalPondStorage - currentPondStorage;
                            item.currentPondRemain = totalPondStorage;
                        }
                    }
                }

                //下期期初蓄水量 = 本期末蓄水量 
                currentPondStorage = item.currentPondRemain;


                return item;
            }
        ).toArray();

        this.outcomes.tendaysStaticsList = list;
    }


    async calculateByField(tendaysWaterUsageList, qtyFieldName, currentPondStorage, totalPondStorage) {
        //currentPondStorage: 第1期的蓄水量
        //totalPondStorage: 總蓄水量
        let initPondStorage = currentPondStorage;

        // let peakWaterUsage = Enumerable.from(tendaysWaterUsageList).where(f => f[qtyFieldName] != null).max(f => f[qtyFieldName]);
        // let peakWaterUsageTendays = Enumerable.from(tendaysWaterUsageList).where(f => f[qtyFieldName] == peakWaterUsage).toArray()[0];

        // console.log('tendaysWaterUsageList', qtyFieldName, tendaysWaterUsageList);
        // console.log('peakWaterUsage', peakWaterUsage, peakWaterUsageTendays);
        console.log(currentPondStorage, totalPondStorage);

        let ifInitRefill = false;
        let list = Enumerable.from(tendaysWaterUsageList).select(
            (item, idx) => {


                let ifPondRefill = false;
                let _waterUsage = (item[qtyFieldName] == null) ? 0 : item[qtyFieldName];
                if (!ifInitRefill && _waterUsage > 0) {
                    ifInitRefill = true;
                    ifPondRefill = true;
                }

                if (_waterUsage > currentPondStorage || ifPondRefill) {
                    //開始灌
                    ifPondRefill = true;
                }

                let currentPondRemain = 0;
                let reservoirGiving = 0;
                if (ifPondRefill) {
                    reservoirGiving = totalPondStorage - (currentPondStorage < 0 ? 0 : currentPondStorage); //期初埤塘不足量
                }


                    if (_waterUsage > currentPondStorage || ifPondRefill){
                        //用水量 > 埤塘剩餘量: 水庫給水
                        reservoirGiving += _waterUsage;//需要用水量;
                        currentPondRemain = reservoirGiving - _waterUsage + currentPondStorage;
                    }else{
                        //用水量 <= 埤塘剩餘量: 水庫不給水
                        //用水量直撞由pond給
                        currentPondRemain = currentPondStorage - _waterUsage;
                    }

                //currentPondRemain = currentPondStorage - _waterUsage + reservoirGiving;
                
                item.reservoirGiving = reservoirGiving;
                item.currentPondRemain = currentPondRemain;

                //下期期初蓄水量 = 本期末蓄水量 
                currentPondStorage = item.currentPondRemain;
                item.ifPondRefill = ifPondRefill;

                return item;
            }
        ).toArray();

        this.outcomes.tendaysStaticsList = list;
    }

    async calculateByFieldToLowerPeakWaterUsage(tendaysWaterUsageList, qtyFieldName, currentPondStorage, totalPondStorage) {
        //currentPondStorage: 第1期的蓄水量
        //totalPondStorage: 總蓄水量
        //let initPondStorage = currentPondStorage;

        // let peakWaterUsage = Enumerable.from(tendaysWaterUsageList).where(f => f[qtyFieldName] != null).max(f => f[qtyFieldName]);
        // let peakWaterUsageTendays = Enumerable.from(tendaysWaterUsageList).where(f => f[qtyFieldName] == peakWaterUsage).toArray()[0];

        // console.log('tendaysWaterUsageList', qtyFieldName, tendaysWaterUsageList);
        // console.log('peakWaterUsage', peakWaterUsage, peakWaterUsageTendays);
        // console.log("calculateByFieldToLowerPeakWaterUsage tendaysWaterUsageList:", tendaysWaterUsageList);
        // console.log("calculateByFieldToLowerPeakWaterUsage qtyFieldName:", qtyFieldName);
        // console.log("calculateByFieldToLowerPeakWaterUsage currentPondStorage:", currentPondStorage);
        // console.log("calculateByFieldToLowerPeakWaterUsage totalPondStorage:", totalPondStorage);
        
        //期初，埤塘可用的水量
        let pondAvailableQty = currentPondStorage;
        // 最大用水量的那旬
        let peakTendaysData = Enumerable.from(tendaysWaterUsageList).where(
            f => f.waterUsage
            == Enumerable.from(tendaysWaterUsageList).max(inn => inn.waterUsage)
        ).firstOrDefault();
        // 最大用水量的前一旬
        // console.log("calculateByFieldToLowerPeakWaterUsage peakTendaysData:", peakTendaysData);
        let oneBeforePeakTendaysData = Enumerable.from(tendaysWaterUsageList).where(
            f => f.number == (peakTendaysData.number - 1)
        ).firstOrDefault();
        // console.log("calculateByFieldToLowerPeakWaterUsage oneBeforePeakTendaysData:", oneBeforePeakTendaysData);
        // console.log('peakTendays', peakTendaysData);
        // console.log('1 before peakTendays', oneBeforePeakTendaysData);

        let tendaysNumberStart2UsePondWater = {};
        if(peakTendaysData[qtyFieldName] > pondAvailableQty){
            tendaysNumberStart2UsePondWater = peakTendaysData;
        }else{
            tendaysNumberStart2UsePondWater = oneBeforePeakTendaysData;
        }

        console.log('*peakTendaysData', peakTendaysData);
        console.log('*oneBeforePeakTendaysData', oneBeforePeakTendaysData);
        console.log('*tendaysNumberStart2UsePondWater', tendaysNumberStart2UsePondWater);
        //如果埤塘蓄水量不夠 『最高峰旬』 + 『最高峰前一旬』扣，則『最高峰旬』要扣所有需水量，剩下的蓄水量給『最高峰前一旬』扣
        if(tendaysNumberStart2UsePondWater.number != peakTendaysData.number){
            //埤塘可以給2旬扣
            // if(peakTendaysData[qtyFieldName] + oneBeforePeakTendaysData[qtyFieldName] < pondAvailableQty){
            //     //不夠兩旬用，第2旬(即高峰)的需求量要全由埤塘支付
            //     tendaysNumberStart2UsePondWater.pondUsage = pondAvailableQty - peakTendaysData[qtyFieldName];
            // }else{
            //     //夠兩旬用，所以第1旬埤塘用量就是第1旬的需求量
            //     tendaysNumberStart2UsePondWater.pondUsage = tendaysNumberStart2UsePondWater[qtyFieldName]
            // }
            let remainsAfterUseForPeak = pondAvailableQty - peakTendaysData[qtyFieldName];
            if(remainsAfterUseForPeak > tendaysNumberStart2UsePondWater[qtyFieldName]){
                tendaysNumberStart2UsePondWater.pondUsage = tendaysNumberStart2UsePondWater[qtyFieldName];
            }else{
                tendaysNumberStart2UsePondWater.pondUsage = remainsAfterUseForPeak;
            }
        }else{
            //第一旬即高峰旬，埤塘可用水量 = 埤塘目前量 - 需求量
            tendaysNumberStart2UsePondWater.pondUsage = pondAvailableQty - tendaysNumberStart2UsePondWater[qtyFieldName];
        }

        let previousRemainPondStorage = 0;

        let list = Enumerable.from(tendaysWaterUsageList).select(
            (item, idx) => {

                //需水量
                let _waterUsage = (item[qtyFieldName] == null) ? 0 : item[qtyFieldName];

                //第一期埤塘蓄水量，為available量；其他期從前一期剩下量來
                let currentPondRemain = (idx == 0) ? pondAvailableQty : previousRemainPondStorage;
                
                //大圳給水量：
                let reservoirGiving = 0;

                //在埤塘還沒開始給水前，用大圳水

                if(item.number < tendaysNumberStart2UsePondWater.number){
                    reservoirGiving = _waterUsage;
                }
                else if(item.number == tendaysNumberStart2UsePondWater.number){
                    //開始用埤塘
                    if(_waterUsage > tendaysNumberStart2UsePondWater.pondUsage){
                        //需求量大於 『可用埤塘量』
                        reservoirGiving = _waterUsage - tendaysNumberStart2UsePondWater.pondUsage;
                        currentPondRemain = currentPondRemain - tendaysNumberStart2UsePondWater.pondUsage;
                    }else{
                        //需求量小於 『可用埤塘量』
                        //全由埤塘供水, 大圳仍不給水
                        reservoirGiving = 0;
                        currentPondRemain = currentPondRemain - _waterUsage;//tendaysNumberStart2UsePondWater.pondUsage;
                    }
                }
                else{
                    console.log(`使用埤塘水量，直到不夠時才再由大圳給水 ${_waterUsage} ${currentPondRemain}`);
                    //使用埤塘水量，直到不夠時才再由大圳給水
                    if(_waterUsage < currentPondRemain){
                        //由埤塘供水
                        reservoirGiving = 0;
                        currentPondRemain = currentPondRemain - _waterUsage;
                    }else{
                        //先用乾埤塘
                        currentPondRemain = currentPondRemain - _waterUsage;

                        //再從大圳給水
                        reservoirGiving = -(currentPondRemain);

                        currentPondRemain = (currentPondRemain < 0) ? 0 : currentPondRemain;
                    }
                }

                console.log(`${item.number} ${_waterUsage} ${currentPondRemain}`);

                
                item.reservoirGiving = reservoirGiving;
                item.currentPondRemain = currentPondRemain;

                // //下期期初蓄水量 = 本期末蓄水量 
                previousRemainPondStorage = item.currentPondRemain;
                //item.reservoirGiving = _waterUsage;
                //item.currentPondRemain = 20

                return item;
            }
        ).toArray();

        //最後3旬補回埤塘的水
        let divider = 3;
        let plantingEndNumber = Enumerable.from(tendaysWaterUsageList).max(f => f.number);
        let startNumber = plantingEndNumber + 1;
        let endNumber = plantingEndNumber + divider;
        let avgQty = totalPondStorage / divider;
        for(let num = startNumber; num <= endNumber; num++){
            console.log(`@#@#`,{
                totalPondStorage: totalPondStorage, 
                number: num, 
                reservoirGiving: avgQty, 
                currentPondRemain: avgQty * (num + 1 - startNumber)
            });
            list.push({
                number: num, 
                reservoirGiving: avgQty, 
                currentPondRemain: avgQty * (num + 1 - startNumber)
            });
        }

        this.outcomes.tendaysStaticsList = list;
    }
}
export {
    WaterGivingByReservoirCalculator
};
