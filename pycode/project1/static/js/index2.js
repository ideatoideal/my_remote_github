$(document).ready(function () {
    initPlugin()
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
                data: legend
            },
            series: [
                {
                    name: legend[0],
                    data: close,
                    type: 'line',
                    smooth: true
                }/*,
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
                }*/
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
                text = text.replace("行","H")//常见多音字处理
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

/**
*
RSV:=(CLOSE-LLV(LOW,9))/(HHV(HIGH,9)-LLV(LOW,9))*100;
K:=SMA(RSV,3,1);
D:=SMA(K,3,1);
J:=3*K-2*D;
REF(J,1)<REF(J,2) AND J>REF(J,1);
* */