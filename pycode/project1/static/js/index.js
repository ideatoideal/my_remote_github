function saveCoding(obj){
    let coding = $(obj).parent(".modal-content").find("textarea").text()

}

$(document).ready(function () {
/*    $('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('.modal-body input').val(recipient)
})*/

    initPlugin()
    post("get_hfq_share", {code: '603999'}, function (data) {
        //开 收 低 高
        //date,open,high,close,low,volume,amount,code
        result = data.result
        let xData = result.getLine(0)
        let close = result.getLine(3)
        let boll = close.boll().toFixed(2)
        let kline = result.getLines("1,3,4,2").toFixed(2)//开,收,低,高
        //开 低 收 高
        let legend = ["蜡烛图", "布林上轨", "布林中轨", "布林下轨"]
        let myChart = echarts.init(document.getElementById('main'));

        let option = {
            toolbox: [
                {
                    top: '70%',
                    feature: {
                        myTool1: {
                            show: true,
                            title: '自定义扩展方法1',
                            icon: 'image://http://echarts.baidu.com/images/favicon.png',
                            onclick: function () {
                                alert('myToolHandler1')
                            }
                        }
                    }
                },
                {
                    top: '82%',
                    feature: {
                        myTool1: {
                            show: true,
                            title: '自定义扩展方法1',
                            icon: 'image://http://echarts.baidu.com/images/favicon.png',
                            onclick: function () {
                                alert('myToolHandler2')
                            }
                        }
                    }
                }
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    type: 'cross',
                    lineStyle: {
                        color: '#376df4',
                        width: 1,
                        opacity: 0.5
                    }
                },
                backgroundColor: 'rgba(255,255,255,1)',
                padding: [5, 10],
                textStyle: {
                    color: '#7588E4',
                },
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)',
                formatter: function (params) {
                    let html = ""
                    if (params[0].axisIndex == 0) {
                        let name = params[0].name;
                        let kline = params[0].data;
                        html = `日期 : ${name}<br>开 : ${kline[1]}<br>收 : ${kline[2]}<br>高 : ${kline[4]}<br>低 : ${kline[3]}<br>`
                        for (let i = 1; i < params.length; i++) {
                            html += `${params[i].seriesName} : ${params[i].data}<br>`
                        }
                    } else {
                        for (let i = 0; i < params.length; i++) {
                            html += `${params[i].seriesName} : ${params[i].data}<br>`
                        }
                    }
                    return html
                }
            },

            grid: [
                {
                    left: '3%',
                    right: '1%',
                    height: '50%'
                }, {
                    left: '3%',
                    right: '1%',
                    top: '70%',
                    height: '10%'
                }, {
                    left: '3%',
                    right: '1%',
                    top: '82%',
                    height: '10%'
                }
            ],

            xAxis: [
                {
                    type: 'category',
                    data: xData,
                    //scale: true
                }
                , {
                    type: 'category',
                    gridIndex: 1,
                    data: xData,
                    axisLabel: {show: false}
                }, {
                    type: 'category',
                    gridIndex: 2,
                    data: xData,
                    axisLabel: {show: false}
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: false
                    }
                }
                , {
                    gridIndex: 1,
                    splitNumber: 3,
                    axisLine: {onZero: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {show: true}
                }, {
                    gridIndex: 2,
                    splitNumber: 4,
                    axisLine: {onZero: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {show: true}
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 90,
                    end: 100,
                    xAxisIndex: [0, 0]
                }
                ,
                {
                    show: true,
                    type: 'slider',
                    start: 90,
                    end: 100,
                    xAxisIndex: [0, 1]
                },
                {
                    show: false,
                    xAxisIndex: [0, 2],
                    type: 'slider',
                    start: 90,
                    end: 100
                }
            ],
            legend: {
                data: legend
            },
            series: [
                {
                    name: legend[0],
                    data: kline,
                    type: 'candlestick',
                    smooth: true,
                    /*itemStyle: {
                        normal: {
                            color: '#FD1050',
                            color0: '#0CF49B',
                            borderColor: '#FD1050',
                            borderColor0: '#0CF49B'
                        }
                    },*/
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ],
                        symbolOffset: [0, "-100%"]
                    }
                },
                {
                    name: legend[1],
                    data: boll[0],
                    type: 'line',
                    smooth: false
                },
                {
                    name: legend[2],
                    data: boll[1],
                    type: 'line',
                    smooth: false
                },
                {
                    name: legend[3],
                    data: boll[2],
                    type: 'line',
                    smooth: false
                },
                {
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name: "图1",
                    data: boll[2],
                    type: 'line',
                    smooth: false
                },
                {
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    name: "图2",
                    data: boll[2],
                    type: 'line',
                    smooth: false
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })
})

function initPlugin() {
    //$('#search').select2()
    //初始搜索
    post("get_search", {}, function (data) {
        let subjects = data.result;
        $("#search").initOption(subjects, true)
        $('#search').select2({
            minimumResultsForSearch: Infinity,
            matcher: function (params, data) {
                let text = data.text
                if ($.trim(params.term) === '') {
                    return data;
                }
                if (text.indexOf(params.term) > -1) {
                    return data
                }
                text = text.replace("行", "H")//常见多音字处理
                if (text.toPinYin().toUpperCase().indexOf(params.term.toUpperCase()) > -1) {
                    return data
                }
                return null
            }
        })
        /*$('#search').select2({
            matcher: function (params, data) {
                if ($.trim(params.term) === '') {
                    return null;
                }
                if (data.text.indexOf(params.term) > -1) {
                    return data
                }
                if (data.text.toPinYin().toUpperCase().indexOf(params.term.toUpperCase()) > -1) {
                    return data
                }
                return null
            }
        })*/
    })
}