const LegendList = [
    {
        groupName: '圖層', 
        list: [
            {
                title: '水源別', 
                mappingKey: 'waterSource', 
                colorItemList: [
                    {
                        title: `大圳水源`, 
                        color: `#AFEEEE`, 
                        seq: 0
                    }, 
                    {
                        title: `混合水源`, 
                        color: `#C7B577`, 
                        seq: 1
                    }, 
                    {
                        title: `河川水源`, 
                        color: `#DE7D01`, 
                        seq: 2
                    }
                ]
            }
        ]
    }, 
    {
        groupName: '埤塘',
        list: [
            {
                title: '蓄水率',  
                mappingKey: 'pondInfo', 
                colorItemList: [
                    {
                        title: `大於等於75%`, 
                        color: `#007BB5`, 
                        seq: 1
                    }, 
                    {
                        title: `50% ~ 75%`, 
                        color: `#FF9004`, 
                        seq: 2
                    }, 
                    {
                        title: `不到50%`, 
                        color: `#E03115`, 
                        seq: 3
                    }
                ]
            }
        ]
    }, 
    {
        groupName: '運算結果', 
        list: [
            {
                title: '水利小組埤塘支應狀況',  
                mappingKey: 'waterAssignment', 
                colorItemList: [
                    {
                        title: `不足10萬噸以下`, 
                        color: `yellow`, 
                        seq: 1
                    }, 
                    {
                        title: `不足10萬噸 ~ 30萬噸`, 
                        color: `orange`, 
                        seq: 2
                    }, 
                    {
                        title: `超過30萬噸`, 
                        color: `red`, 
                        seq: 3
                    }
                ]
            }
        ]
    }, 
    {
        groupName: '種植坵塊', 
        list: [
            {
                title: '開灌地區坵塊',  
                mappingKey: 'plantingField', 
                colorItemList: [
                    {
                        title: `第4旬`, 
                        color: `green`, 
                        seq: 1
                    }, 
                    {
                        title: `第5旬`, 
                        color: `#FFD700`, 
                        seq: 2
                    }, 
                    {
                        title: `第6旬`, 
                        color: `blue`, 
                        seq: 3
                    }, 
                    {
                        title: `第7旬`, 
                        color: `#70543E`, 
                        seq: 3
                    }
                ]
            }
        ]
    }, 
];
const MapStyle = {
    //小利小組
    waterGroup: {
        symbolDefinition: [
            { key: 'original', description: '原始設定' },
            { key: 'pinned', description: '被選取的' },
            { key: 'waterFromRiver', description: '水源從河川' },
            { key: 'waterFromPond', description: '水源從埤塘' },
            { key: 'waterFromReservior', description: '水源從水庫' },
            { key: 'waterFromReserviorNRiver', description: '水源從水庫+河川' },
        ],
        original: {
            symbol: {
                //color: '#DBFCBD',
                //style: 'solid',
                style: 'none',
                type: 'simple-fill',
                outline: {
                    style: 'solid',
                    color: '#6E6E6E'
                }
            },
            labelingInfo: [
                {
                    labelExpression: "[水利小組名稱]",
                    // labelExpressionInfo: {
                    //     expression: "'小組' + $feature.水利小組名稱 + TextFormatting.NewLine + $feature.水利小組名稱"
                    //   },
                    labelPlacement: "always-horizontal",
                    symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: [0, 0, 0, 0.85],
                        font: {
                            size: 10,
                            weight: "bolder"
                        }
                    },
                    //minScale: 80000,  //city range
                    minScale: 80000,
                    maxScale: 0,
                },
            ], 
        },
        pinned: {
            symbol: {

            }
        },
        waterFromRiver: {
            symbol: {
                color: LegendList[0].list[0].colorItemList[2].color, //'#DE7D01', //'#ADD8E6',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#6E6E6E', 
                }
            },
        },
        waterFromPond: {
            symbol: {
                color: '#90EE90',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#6E6E6E'
                }
            },
        },
        waterFromReservior: {
            symbol: {
                color: LegendList[0].list[0].colorItemList[0].color, //'#AFEEEE',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#6E6E6E'
                }
            },
        },
        waterFromReserviorNRiver: {
            symbol: {
                color: LegendList[0].list[0].colorItemList[1].color, //'#C7B577', //'#5F9EA0',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#6E6E6E'
                }
            },
        },
        waterLackingLite: {
            symbol: {
                color: LegendList[2].list[0].colorItemList[0].color, //'yellow', 
                style: 'solid',
                type: 'simple-fill',
                //style: 'none',
                // outline: {
                //     style: 'solid',
                //     color: 'yellow', 
                //     width: 3, 
                // }
            },
        }, 
        waterLackingMiddle: {
            symbol: {
                color: LegendList[2].list[0].colorItemList[1].color, //'orange', 
                style: 'solid',
                type: 'simple-fill',

                // style: 'none',
                // outline: {
                //     style: 'solid',
                //     color: 'orange', 
                //     width: 3, 
                // }
            },
        }, 
        waterLackingSevere: {
            symbol: {
                color: LegendList[2].list[0].colorItemList[2].color, //'red', 
                style: 'solid',
                type: 'simple-fill',
                // style: 'none',
                // outline: {
                //     style: 'solid',
                //     color: 'red', 
                //     width: 3, 
                // }
            },
        }, 
        // noneWaterLacking: {
        //     symbol: {
                
        //         type: 'simple-fill',
        //         style: 'none',
        //         outline: {
        //             style: 'solid',
        //             color: 'yellow', 
        //             width: 3, 
        //         }
        //     },
        // }, 
    }, 
    irrigationGroup: {
        symbolDefinition: [
            { key: '1', description: '組別代碼' },
            { key: '2', description: '組別代碼' },
            { key: '3', description: '組別代碼' },
            { key: '4', description: '組別代碼' },
            { key: '5', description: '組別代碼' },
            { key: '6', description: '組別代碼' },
        ],

        'original': {
            symbol: {
                //color: [0, 0, 255, 0.5],
                type: 'simple-fill',
                style: 'none',
                outline: {
                    style: 'solid',
                    color: 'black', //'green', 
                    width: 1, 
                }
            },
        }, 
        'picked': {
            symbol: {
                //color: [0, 0, 255, 0.5],
                type: 'simple-fill',
                style: 'none',
                outline: {
                    style: 'solid',
                    color: 'black', //'green', 
                    width: 1, 
                }
            },
        }, 
        '桃一': {
            symbol: {
                color: '#88ceeb',
                //color: [0, 0, 255, 0.5],
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: 'black', //'green', 
                    width: 2, 
                }
            },
        }, 
        '桃二': {
            symbol: {
                color: '#88ceeb',
                //color: [0, 0, 255, 0.5],
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: 'black', //'red', 
                    width: 2, 
                }
            },
        }, 
        '桃三': {
            symbol: {
                color: '#88ceeb',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: 'black', 
                    width: 2, 
                }
            },
        }, 
        '石一': {
            symbol: {
                color: '#88ceeb',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: 'blue', //'black', 
                    width: 2, 
                }
            },
        }, 
        '石二': {
            symbol: {
                color: '#88ceeb',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: 'blue', //'Orange', 
                    width: 2, 
                }
            },
        }, 
        labelingInfo: [
            {
                labelExpression: "[分區]",
                // labelExpressionInfo: {
                //     expression: "'小組' + $feature.水利小組名稱 + TextFormatting.NewLine + $feature.水利小組名稱"
                //   },
                labelPlacement: "always-horizontal",
                symbol: {
                    type: "text", // autocasts as new TextSymbol()
                    // color: [0, 0, 0, 0.85],
                    color: '#000000',
                    font: {
                        size: 15,
                        weight: "bolder"
                    }
                },
                // //minScale: 80000,  //city range
                // minScale: 80000,
                // maxScale: 0,
            },
        ], 
    }, 
    workstation: {
        symbolDefinition: [
            { key: 'original', description: '原始設定' },
            //{ key: 'pinned', description: '被選取的' },
        ],
        original: {
            symbol: {
                color: '#f4f4f4',
                type: 'simple-fill',
                style: 'none',
                outline: {
                    style: 'solid',
                    color: '#000', 
                    width: 1
                }
            },
            labelingInfo: [
                {
                    labelExpression: "[工作站名稱]",
                    labelPlacement: "always-horizontal",
                    symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: [0, 0, 0, 0.85],
                        font: {
                            size: 10,
                            weight: "bolder"
                        }
                    },
                    //minScale: 80000,  //city range
                    minScale: 300000,
                    maxScale: 90000,
                },
            ], 
        },
        originalForIrrigationDelay: {
            symbol: {
                color: '#f4f4f4',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#000', 
                    width: 1
                }
            },
            labelingInfo: [
                {
                    labelExpression: "[工作站名稱]",
                    labelPlacement: "always-horizontal",
                    symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: [0, 0, 0, 0.85],
                        font: {
                            size: 10,
                            weight: "bolder"
                        }
                    },
                    //minScale: 80000,  //city range
                    minScale: 300000,
                    maxScale: 90000,
                },
            ], 
        },
        // pinned: {
        //     symbol: {
        //         color: '#6B8E23',
        //         type: 'simple-fill',
        //         style: 'solid',
        //         outline: {
        //             style: 'solid',
        //             color: '#000000', 
        //             width: 2
        //         }
        //     },
        // },
    }, 
    pond: {
        symbolDefinition: [
            { key: 'original', description: '原始設定' },
            { key: 'pinned', description: '被選取的' },
        ],
        original: {
            symbol: {
                // color: '#85D384',
                // style: 'solid',
                style: 'none',
                type: 'simple-fill',
                outline: {
                    style: 'solid',
                    color: '#6E6E6E'
                }
            },
            labelingInfo: [
                // {
                //     labelExpression: "[埤塘名稱]",
                //     labelPlacement: "always-horizontal",
                //     symbol: {
                //         type: "text", // autocasts as new TextSymbol()
                //         color: [0, 0, 0, 0.85],
                //         font: {
                //             size: 10,
                //             weight: "bolder"
                //         }
                //     },
                //     //minScale: 80000,  //city range
                //     minScale: 300000,
                //     maxScale: 90000,
                // },
            ], 
        },
        pinned: {
            symbol: {
                color: '#6B8E23',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#000000', 
                    width: 2
                }
            },
        },
        water76Up: {
            symbol: {
                color: '#007BB5',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#007BB5', 
                    width: 1
                }
            },
        },
        water50_75: {
            symbol: {
                color: '#FF9004',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#FF9004', 
                    width: 1
                }
            },
        },
        water50AndBelow: {
            symbol: {
                color: '#E03115',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: '#E03115', 
                    width: 1
                }
            },
        }
    }, 
    //幹線
    mainChannel: {
        symbolDefinition: [
            { key: 'original', description: '原始設定' },
            { key: 'pinned', description: '被選取的' },
        ],
        original: {
            symbol: {
                type: 'simple-line',
                cap: "round",
                color: 'red',
                join: "round",
                miterLimit: 1,
                style: "solid",
                width: 2
            },
        },
        taoyuanCanal:{
            symbol: {
                type: 'simple-line',
                cap: "round",
                color: 'blue',
                join: "round",
                miterLimit: 1,
                style: "solid",
                width: 4
            },
        },
        guangfuCanal: {
            symbol: {
                type: 'simple-line',
                cap: "round",
                color: 'purple',
                join: "round",
                miterLimit: 1,
                style: "solid",
                width: 4
            },
        },
        pinned: {
            symbol: {

            }
        },
    }, 
    //支線
    branchChannel: {
        symbolDefinition: [
            { key: 'original', description: '原始設定' },
            { key: 'pinned', description: '被選取的' },
        ],
        original: {
            symbol: {
                type: 'simple-line',
                cap: "round",
                color: 'red',
                join: "round",
                miterLimit: 1,
                style: "solid",
                width: 1
            },
        },
        pinned: {
            symbol: {

            }
        },
    }, 
    reservoir:{
        symbolDefinition: [
            { key: 'original', description: '原始設定' },
        ],
        original: {
            symbol: {
                color: 'blue',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'solid',
                    color: 'black'
                }
            },
            labelingInfo: [
                {
                    labelExpression: "NAME",
                    labelPlacement: "always-horizontal",
                    symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: [0, 0, 0, 0.85],
                        font: {
                            size: 10,
                            weight: "bolder"
                        }
                    },
                    //minScale: 80000,  //city range
                    minScale: 300000,
                    maxScale: 90000,
                },
            ], 
        },
        pinned: {
            symbol: {

            }
        },
    },
    plantingField: {
        symbolDefinition: [
            { key: 'original', description: '原始設定' },
            //{ key: 'pinned', description: '被選取的' },
        ],
        original: {
            symbol: {
                color: 'green',
                //color: '#94C3A9',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'none',
                    // style: 'solid',
                    // color: 'black', 
                    // width: 2
                }
            },
            // labelingInfo: [
            //     {
            //         labelExpression: "[工作站名稱]",
            //         labelPlacement: "always-horizontal",
            //         symbol: {
            //             type: "text", // autocasts as new TextSymbol()
            //             color: [0, 0, 0, 0.85],
            //             font: {
            //                 size: 10,
            //                 weight: "bolder"
            //             }
            //         },
            //         //minScale: 80000,  //city range
            //         minScale: 300000,
            //         maxScale: 90000,
            //     },
            // ], 
        },
        overlay: {
            symbol: {
                color: [0, 128, 8, 0.4],
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'none',
                    // style: 'solid',
                    // color: 'black', 
                    // width: 2
                }
            },
            // labelingInfo: [
            //     {
            //         labelExpression: "[工作站名稱]",
            //         labelPlacement: "always-horizontal",
            //         symbol: {
            //             type: "text", // autocasts as new TextSymbol()
            //             color: [0, 0, 0, 0.85],
            //             font: {
            //                 size: 10,
            //                 weight: "bolder"
            //             }
            //         },
            //         //minScale: 80000,  //city range
            //         minScale: 300000,
            //         maxScale: 90000,
            //     },
            // ], 
        },

        startOnTendays4: {
            symbol: {
                color: LegendList[3].list[0].colorItemList[0].color, //'green', //'#32CD32',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'none',
                }
            },
        },
        startOnTendays5: {
            symbol: {
                color: LegendList[3].list[0].colorItemList[1].color, //'#FFD700',   //'yellow',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'none',
                }
            },
        },
        startOnTendays6: {
            symbol: {
                color: LegendList[3].list[0].colorItemList[2].color, //'blue', //'#556B2F',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'none',
                }
            },
        },
        startOnTendays7: {
            symbol: {
                color: LegendList[3].list[0].colorItemList[3].color, //'#70543E',
                type: 'simple-fill',
                style: 'solid',
                outline: {
                    style: 'none',
                }
            },
        },

    }, 
};