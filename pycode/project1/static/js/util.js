function post(url, data, callback1, callback2) {
    $.ajax({
        url: url,
        type: 'POST', //GET
        async: true,    //或false,是否异步
        data: data,
        timeout: 30000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            console.log(xhr)
            console.log('发送前')
        },
        success: function (data, textStatus, jqXHR) {
            console.log(data)
            console.log(textStatus)
            console.log(jqXHR)
            if (callback1 != null) callback1(data, textStatus, jqXHR)
        },
        error: function (xhr, textStatus) {
            alert("错误")
            console.log('错误')
            console.log(xhr)
            console.log(textStatus)
            if (callback2 != null) callback2(xhr, textStatus)
        },
        complete: function () {
            console.log('结束')
        }
    })
}

Array.prototype.getLine = function (lineNo) {
    let re = [];
    for (let i = 0; i < this.length; i++) {
        re.push(this[i][lineNo])
    }
    return re;
}
// 如 list.getLinse("3,1-4,5") 返回3,1,2,3,4,5列
Array.prototype.getLines = function (str) {
    let re = [];
    let strs = str.split(",");
    let tmp = [], range;
    for (let i = 0; i < strs.length; i++) {
        if (strs[i].indexOf("-") > 0) {
            range = strs[i].split("-");
            for (let j = parseInt(range[0]); j <= parseInt(range[1]); j++) {
                tmp.push(j)
            }
        } else {
            tmp.push(parseInt(strs[i]))
        }
    }
    let row = []
    for (let i = 0; i < this.length; i++) {
        row = []
        for (let j = 0; j < tmp.length; j++) {
            row.push(this[i][tmp[j]])
        }
        re.push(row)
    }
    return re;
}

Array.prototype.toFixed = function (x) {
    let re = [];
    for (let i = 0; i < this.length; i++) {
        if(this[i]==null) re.push(null)
        else re.push(this[i].toFixed(x))
    }
    return re
}