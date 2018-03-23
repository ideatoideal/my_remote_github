function share_compute(list, programme) {
    let params = null;
    let data = list.slice(0, list.length)
    let result = []
    for (let i = 0; i < list.length; i++) {
        params = {
            date: list[0],
            open: list[1],
            high: list[2],
            close: list[3],
            low: list[4],
            volume: list[5],
            amount: list[6],
            data: data
        }
        result.append(share_programme(params,programme))
    }
}

function share_programme(params,programme) {
    let str = "function share_simulation(){ params = JSON.parse("+JSON.stringify(params)+") ";
        str += `
            for(key in params){
                var key = params[key]
            }
        `
        str+= programme
        str+= " return "//TODO
    str = "} share_simulation()"
    eval(str)
}

function compute(list0, list, callback) {
    let tmp = list0.slice(0, list0.length)
    for (let i = 0; i < list0.length; i++) {
        if (tmp[i] != null && list[i] != null) {
            tmp[i] = callback(list0[i], list[i])
        }
        else {
            tmp[i] = null
        }
    }
    return tmp
}

function compute2(list0, callback) {
    let tmp = list0.slice(0, list0.length)
    for (let i = 0; i < list0.length; i++) {
        if (tmp[i] != null) {
            tmp[i] = callback(list0[i])
        }
        else {
            tmp[i] = null
        }
    }
    return tmp
}

function compute3(list0, list, callback) {
    let tmp = list0.slice(0, list0.length)
    for (let i = 0; i < list0.length; i++) {
        if (tmp[i] != null && list[i] != null) {
            tmp[i] = callback(list0, list, i)
        }
        else {
            tmp[i] = null
        }
    }
    return tmp
}

//求移动平均
Array.prototype.ma = function (x = 5) {
    let tmp = Array(this.length).fill(0);
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < this.length; j++) {
            if (j - i >= 0) {
                if (this[j - i] != null) tmp[j] = tmp[j] + this[j - i]
            }
        }
    }
    for (let i = 0; i < this.length; i++) {
        if (i < x - 1) {
            tmp[i] = null
        } else {
            if (tmp[i] != null) tmp[i] = tmp[i] / x
        }
    }
    return tmp
}


//求和
Array.prototype.sum = function () {
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
        if (this[i] != null) sum += this[i]
    }
    return sum
}

//平均
Array.prototype.average = function () {
    return this.sum() / this.length
}


//标准差
Array.prototype.stdev = function (x = 20) {
    let tmp = compute3(this, this.ma(x), function (list1, list2, i) {
        if (i >= x - 1) {
            let sum = 0;
            for (let t = i - x + 1; t <= i; t++) {
                if (list1[t] == null || list2[i] == null) return null
                sum += Math.pow(list1[t] - list2[i], 2)
            }
            return Math.pow(sum / x, 1 / 2);
        }
        return null
    })
    return tmp
}

//加
Array.prototype.add = function (list) {
    if (list instanceof Array) {
        return compute(this, list, function (a, b) {
            return a + b
        })
    } else {//若为数字
        return compute2(this, function (a) {
            return a + list
        })
    }
}

//减
Array.prototype.minus = function (list) {
    if (list instanceof Array) {
        return compute(this, list, function (a, b) {
            return a - b
        })
    } else {//若为数字
        return compute2(this, function (a) {
            return a - list
        })
    }
}


//乘
Array.prototype.multiply = function (list) {
    if (list instanceof Array) {
        return compute(this, list, function (a, b) {
            return a * b
        })
    } else {//若为数字
        return compute2(this, function (a) {
            return a * list
        })
    }
}

//除
Array.prototype.devide = function (list) {
    if (list instanceof Array) {
        return compute(this, list, function (a, b) {
            return a / b
        })
    } else {//若为数字
        return compute2(this, function (a) {
            return a / list
        })
    }
}

//次方
//除
Array.prototype.pow = function (list) {
    if (list instanceof Array) {
        return compute(this, list, function (a, b) {
            return Math.pow(a, b)
        })
    } else {//若为数字
        return compute2(this, function (a) {
            return Math.pow(a, list)
        })
    }
}


Array.prototype.boll = function (x = 20) {
    let std = this.stdev(x).multiply(2)
    let tmp = []

    tmp.push(this.ma(x).add(std))
    tmp.push(this.ma(x))
    tmp.push(this.ma(x).minus(std))
    return tmp
}