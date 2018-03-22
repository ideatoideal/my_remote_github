$(document).ready(function () {

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
            dataZoom: [
                {
                    type: 'inside',
                    start: 90,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    start: 90,
                    end: 100
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
                    let name = params[0].name;
                    let kline = params[0].data;
                    let html = `日期 : ${name}<br>开 : ${kline[1]}<br>收 : ${kline[2]}<br>高 : ${kline[4]}<br>低 : ${kline[3]}<br>`
                    for (let i = 1; i < params.length; i++) {
                        html += `${params[i].seriesName} : ${params[i].data}<br>`
                    }
                    return html
                }
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                scale: true
            },
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
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })


})