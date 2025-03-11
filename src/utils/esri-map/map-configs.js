class MapConfigs {
    userSettings = {
        sublayerVisibilities: {
            '10': { visible: false, },
            '11': { visible: false, },
            '13': { visible: false, },
            '14': { visible: false, },
            '15': { visible: false, },
            '16': { visible: false, },
            '25': { visible: false, },
            '26': { visible: false, },
            '37': { visible: false, },
        },
        sublayerDefaults: {
            '10': {definitionExpression: null },
            //'11': {definitionExpression: null },
            '11': {definitionExpression: "系統名稱 in ('桃園大圳', '光復圳', '石門大圳', '桃園大圳導水路')" },
            '13': {definitionExpression: null },
            '14': {definitionExpression: null },
            '15': {definitionExpression: null },
            '16': {definitionExpression: "分區 <> '桃沒分區'"},
            '25': {definitionExpression: `NAME = '石門水庫'` },
            //'26': {definitionExpression: "系統名稱 in ('桃園大圳', '光復圳')" },
            '26': {definitionExpression: null },
            '37': {definitionExpression: null },
        }

    };
    constructor(_userSettings) {
        if (_userSettings != null) {
            if(_userSettings.sublayerVisibilities != null){
                Object.assign(this.userSettings.sublayerVisibilities, _userSettings.sublayerVisibilities);
                //$.extend(true, this.userSettings.sublayerVisibilities, _userSettings.sublayerVisibilities);
                console.log('map-config', _userSettings.sublayerVisibilities, this.userSettings.sublayerVisibilities);
            }
        }
    }
    getSublayers() {
        let sublayers = [
            {
                id: 25,   //水庫
                //definitionExpression: `NAME = '石門水庫'`,
                renderer: {
                    //type: "unique-value",
                    type: "simple",
                    //defaultSymbol: MapStyle.reservoir.original.symbol
                    symbol: MapStyle.reservoir.original.symbol,
                },
                labelingInfo: MapStyle.reservoir.original.labelingInfo
            },
            {
                id: 15,   //BB_1管理處範圍_桃管_石管
                definitionExpression: this.mapBaseQuery,
                visible: false,
            },

            {
                id: 13,   //BB_3工作站範圍_桃管_石管
                definitionExpression: this.mapBaseQuery,
                renderer: {
                    type: "simple",
                    symbol: MapStyle.workstation.original.symbol,//MapStyle.workstation.original.symbol,
                },
                labelingInfo: MapStyle.workstation.original.labelingInfo,
            },
            {
                id: 14,  //BB_6埤塘_1120512_桃管_石管
                definitionExpression: this.mapBaseQuery,
                renderer: {
                    type: "simple",
                    symbol: MapStyle.pond.original.symbol,
                },
                labelingInfo: MapStyle.pond.original.labelingInfo,
                //visible: false,
            },
            // {
            //     id: 12,  //BB_5圳路渠道_桃管_石管_所有渠道
            //     //definitionExpression: this.mapBaseQuery,
            //     visible: false,
            // },
            // {
            //     id: 27,  //支線
            //     definitionExpression: this.mapBaseQuery,
            //     renderer: {
            //         type: "simple",
            //         symbol: MapStyle.branchChannel.original.symbol,
            //     },
            // },


            // {
            //     id: 11,   //BB_5圳路渠道_桃管_石管_幹支線
            //     definitionExpression: this.mapBaseQuery,
            //     renderer: {
            //         type: "unique-value",
            //         field: "系統類別名稱",
            //         uniqueValueInfos: [
            //             {
            //                 "value": '支線',
            //                 "symbol": MapStyle.branchChannel.original.symbol,
            //                 "label": '支線'
            //             },
            //             {
            //                 "value": '幹線',
            //                 "symbol": MapStyle.mainChannel.original.symbol,
            //                 "label": '幹線'
            //             },
            //         ]
            //     },
            // },
            {
                id: 11,   //BB_5圳路渠道_桃管_石管_幹支線
                definitionExpression: this.mapBaseQuery,
                field: "系統名稱",
                uniqueValueInfos: [
                    {
                        "value": '桃園大圳',
                        "symbol": MapStyle.mainChannel.taoyuanCanal.symbol,
                        "label": '桃園大圳'
                    },
                    {
                        "value": '光復圳',
                        "symbol": MapStyle.mainChannel.guangfuCanal.symbol,
                        "label": '光復圳'
                    },
                    {
                        "value": '石門大圳',
                        "symbol": MapStyle.mainChannel.guangfuCanal.symbol,
                        "label": '石門大圳'
                    },
                    {
                        "value": '桃園大圳導水路',
                        "symbol": MapStyle.mainChannel.guangfuCanal.symbol,
                        "label": '桃園大圳導水路'
                    },
                ]
            },
            {
                id: 26,  //幹線
                //definitionExpression: "系統名稱 in ('桃園大圳', '光復圳')",
                renderer: {
                    // type: "simple",
                    // symbol: MapStyle.mainChannel.original.symbol,
                    type: "unique-value",
                    defaultSymbol: MapStyle.mainChannel.original.symbol,
                    field: "系統名稱",
                    uniqueValueInfos: [
                        {
                            "value": '桃園大圳',
                            "symbol": MapStyle.mainChannel.taoyuanCanal.symbol,
                            "label": '桃園大圳'
                        },
                        {
                            "value": '光復圳',
                            "symbol": MapStyle.mainChannel.guangfuCanal.symbol,
                            "label": '光復圳'
                        },
                    ]
                },
                labelingInfo: [
                    {
                        labelExpression: "系統名稱",
                        labelPlacement: "always-horizontal",
                        symbol: {
                            type: "text", // autocasts as new TextSymbol()
                            color: [0, 0, 0, 0.85],
                            font: {
                                size: 10,
                                weight: "bolder"
                            }
                        },
                        // //minScale: 80000,  //city range
                        // minScale: 300000,
                        // maxScale: 90000,
                    },
                ],
            },
            // {
            //     id: 28,  //幹線
            //     definitionExpression: "系統名稱 in ('石門大圳', '光復圳')",
            //     renderer: {
            //         // type: "simple",
            //         // symbol: MapStyle.mainChannel.original.symbol,
            //         type: "unique-value",
            //         defaultSymbol: MapStyle.mainChannel.original.symbol,
            //         field: "系統名稱",
            //         uniqueValueInfos: [
            //             {
            //                 "value": '石門大圳',
            //                 "symbol": MapStyle.mainChannel.taoyuanCanal.symbol,
            //                 "label": '石門大圳'
            //             },

            //             {
            //                 "value": '光復圳',
            //                 "symbol": MapStyle.mainChannel.guangfuCanal.symbol,
            //                 "label": '光復圳'
            //             },
            //         ]
            //     },
            //     visible: true,
            // },
            {
                id: 16,   //BB_7灌區
                definitionExpression: "分區 <> '桃沒分區'", //this.mapBaseQuery,
                renderer: {
                    type: "unique-value",
                    field: "分區",
                    uniqueValueInfos: this.getUniqueValueInfosForIrrigationGroup()
                },
                visible: true,
                // opacity: 0.5,
                labelingInfo:
                    MapStyle.irrigationGroup.labelingInfo,
            },
            // {
            //   id: 32,   //BB_32 種植密度坵塊
            //   definitionExpression: "1 = 2",
            //   // renderer: {
            //   //     type: "unique-value",
            //   //     field: "分區",
            //   //     uniqueValueInfos: this.getUniqueValueInfosForIrrigationGroup()
            //   // },
            //   renderer: {
            //     type: "simple",
            //     symbol: MapStyle.plantingField.original.symbol,
            //   },
            //   visible: false,

            // },
            {
                id: 37,   //BB_37 種植密度坵塊
                definitionExpression: "1 = 2",
                // renderer: {
                //     type: "unique-value",
                //     field: "分區",
                //     uniqueValueInfos: this.getUniqueValueInfosForIrrigationGroup()
                // },
                renderer: {
                    type: "simple",
                    symbol: MapStyle.plantingField.original.symbol,
                },
                visible: true,

            },
            {
                id: 32,   //BB_32 種植密度坵塊(原始)
                definitionExpression: "1 = 2",
                // renderer: {
                //     type: "unique-value",
                //     field: "分區",
                //     uniqueValueInfos: this.getUniqueValueInfosForIrrigationGroup()
                // },
                renderer: {
                    type: "simple",
                    symbol: MapStyle.plantingField.original.symbol,
                },
                visible: false,

            },
            {
                id: 39,   //BB_39 種植密度坵塊(以水利小組為單位)
                definitionExpression: "1 = 2",
                // renderer: {
                //     type: "unique-value",
                //     field: "分區",
                //     uniqueValueInfos: this.getUniqueValueInfosForIrrigationGroup()
                // },
                renderer: {
                    type: "simple",
                    symbol: MapStyle.plantingField.original.symbol,
                },
                visible: true,

            },
            {
                id: 10,   //BB_4水利小組範圍_桃管_石管
                definitionExpression: this.mapBaseQuery,
                renderer: {
                    //type: "unique-value",
                    //defaultSymbol: MapStyle.waterGroup.original.symbol
                    type: "simple",
                    symbol: MapStyle.waterGroup.original.symbol
                },
                labelingInfo: MapStyle.waterGroup.original.labelingInfo,
                //visible: false,
            }
        ];

        sublayers.forEach(item => {
            //設定defaults:
            if (this.userSettings.sublayerDefaults[item.id] != null) {
                item.definitionExpression = this.userSettings.sublayerDefaults[item.id].definitionExpression;
            }

            //套用custom設定
            let customSettings = this.userSettings.sublayerVisibilities[item.id];
            if (customSettings != null) {
                item.visible = customSettings.visible;
                if(customSettings.definitionExpression != null){
                    item.definitionExpression = customSettings.definitionExpression;
                }
                if(customSettings.renderer != null){
                    item.renderer = customSettings.renderer;
                }
            }
        });

        return sublayers;
    }

    getUniqueValueInfosForIrrigationGroup() {
        let list = ['桃一', '桃二', '桃三', '石一', '石二'];


        let returnList = [];
        list.forEach(item => {
            let _symbol = MapStyle.irrigationGroup.original.symbol//MapStyle.irrigationGroup[item].symbol;
            returnList.push(
                {
                    "value": item,
                    "symbol": _symbol,
                    "label": item
                }
            )
        });
        return returnList;
    }
    //工作站名稱
    getUniqueValueInfosForWaterGroup() {
        let list = ['桃園工作站', '大竹工作站', '大園工作站', '大崙工作站', '草漯工作站', '新坡工作站', '觀音工作站', '新屋工作站', '湖口工作站', '八德工作站', '中壢工作站', '過嶺工作站', '楊梅工作站', '富岡工作站', '湖口工作站'];


        let returnList = [];
        list.forEach(item => {
            let _symbol = MapStyle.waterGroup.original.symbol//MapStyle.irrigationGroup[item].symbol;
            returnList.push(
                {
                    "value": item,
                    "symbol": _symbol,
                    "label": item
                }
            )
        });
        return returnList;
    }
}
export { MapConfigs };