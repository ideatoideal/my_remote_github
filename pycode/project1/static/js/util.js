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
