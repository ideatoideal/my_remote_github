$(document).ready(function () {

    post("get_hfq_share", {code: '000001'}, function (data) {
        //date,open,high,close,low,volume,amount,code
        result = data.result
        let xData = result.getLine(0)
        let close = result.getLine(3)
        let boll = close.boll()
        //开 低 收 高
        let legend = ["实际", "上", "均", "下"]
        let myChart = echarts.init(document.getElementById('main'));

        let option = {
            dataZoom: {
                type: 'inside',
                start: 98,
                end: 100
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                backgroundColor: 'rgba(255,255,255,1)',
                padding: [5, 10],
                textStyle: {
                    color: '#7588E4',
                },
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
            },
            legend: {
                data:legend
            },
            series: [
                {
                    name: legend[0],
                    data: close,
                    type: 'line',
                    smooth: true
                },
                {
                    name: legend[1],
                    data: boll[0],
                    type: 'line',
                    smooth: true
                },
                {
                    name: legend[2],
                    data: boll[1],
                    type: 'line',
                    smooth: true
                },
                {
                    name: legend[3],
                    data: boll[2],
                    type: 'line',
                    smooth: true
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })


})