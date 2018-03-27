import util
import time
import tushare
import share_tool
import pymysql


def get_connection():
    conn = pymysql.connect("localhost", "test", "199104", "testdb", use_unicode=True,
                           charset="utf8")  # 默认utf-8 不然插入可能会出错
    return conn


def close_connection(conn):
    conn.close()


def get_time_to_market(conn, code):
    timestring = util.get_object(conn, "select timeToMarket from stock_basics where code = " + code)
    tmp = time.strptime(str(timestring), '%Y%m%d')
    return time.strftime('%Y-%m-%d', tmp)


def get_end_date_from_log(conn, code, type):
    ct = util.get_object(conn, "select count(1) from update_log where code = " + code + " and type ='" + type + "'")
    if ct == 0:
        return None
    else:
        return str(util.get_object(conn,
                                   "select end_date from update_log where code = " + code + " and type = '" + type + "'"))


def set_update_log(conn, code, type, end=None):
    cursor = conn.cursor()
    begin_date = get_time_to_market(conn, code)
    last_end_date = get_end_date_from_log(conn, code, type)
    end_date = util.get_now_day()
    if end is not None:
        end_date = end
    if last_end_date is None:
        # 初始数据
        util.insert(conn, "update_log", {"code": code, "begin_date": begin_date, "end_date": end_date, "type": type})
    else:
        # 更新数据
        util.update(conn, "update_log", {"end_date": end_date}, {"code": code, "type": type})
    cursor.close()


def is_last_update_day(conn, code, type):
    end_date = get_end_date_from_log(conn, code, type)
    if end_date is None:
        return False
    last_end_day = util.timestring_to_day(end_date)
    end_day = util.get_now_day()
    if last_end_day == end_day:
        return True
    return False


def save_share(conn, code, autype):
    time_to_market_day = get_time_to_market(conn, code)
    now_day = util.get_now_day()
    # log是否最新日期 若否 更新内容
    pause = 5
    if not is_last_update_day(conn, code, "hfq"):
        end_date = get_end_date_from_log(conn, code, "hfq")
        share_data = None
        if end_date is None:
            share_data = share_tool.get_h_data(code, start=time_to_market_day, end=now_day, autype="hfq", in_batch=True,
                                               pause=pause)
            print(code + "已从网络下载(hfq),从" + time_to_market_day + "到" + now_day)
        else:
            #end_date = util.get_yesterday(end_date)#拿昨天的 重复插入不要紧 逻辑上有可能会漏拿一天
            share_data = share_tool.get_h_data(code, start=end_date, end=now_day, autype="hfq", in_batch=True,
                                               pause=pause)
            print(code + "已从网络下载(hfq),从" + end_date + "到" + now_day)
        # 保存dataframe数据至库表
        util.save_dataframe(conn=conn, data=share_data, table_name="hfq_share", primary_key="date,code,autype",
                            save_index=True)
        end = str(util.get_object(conn, "select max(date) from hfq_share where code = '" + code + "'"))
        # 更新log日期
        set_update_log(conn, code, "hfq", end)
        conn.commit()
        print(code + "已更新至" + end)

def save_index_share(conn,code):
    now_day = util.get_now_day();
    pause = 5
    if not is_last_update_day(conn, code, "index"):
        end_date = get_end_date_from_log(conn, code, "index")
        share_data = None
        if end_date is None:
            share_data = share_tool.get_h_data(code,start="1992-01-01",in_batch=True,index=True,pause=pause)
            print(code + "已从网络初始化(index_hfq),到" + now_day)
        else:
            end_date = util.get_yesterday(end_date)
            share_data = share_tool.get_h_data(code, start=end_date, end=now_day, in_batch=True,
                                               pause=pause)
            print(code + "已从网络下载(hfq),从" + end_date + "到" + now_day)
        # 保存dataframe数据至库表
        util.save_dataframe(conn=conn, data=share_data, table_name="index_share", primary_key="date,code",
                            save_index=True)
        end = str(util.get_object(conn, "select max(date) from index_share where code = '" + code + "'"))
        # 更新log日期
        set_update_log(conn, code, "index", end)
        conn.commit()
        print(code + "已更新至" + end)


def is_fundamental_update(conn, type):
    ct = util.get_object(conn, "select count(1) from fundamental_update_log where type = '" + type + "'");
    if ct == 0:
        return False
    else:
        return True


def get_fundamental_year(conn, type):
    return util.get_object(conn, "select max(year) from fundamental_update_log where type = '" + type + "'")


def get_fundamental_quarter(conn, type):
    return util.get_object(conn,
                           "select max(quarter) from fundamental_update_log where type = '" + type + "' and  year = (select max(year) from fundamental_update_log where type = '" + type + "') ")


def is_fundamental_save(conn, year, quarter, type):
    ct = util.get_object(conn, "select count(1) from fundamental_update_log where type = '" + type + "' and year = " + str(year) + " and quarter = " + str(quarter));
    if ct == 0:
        return False
    else:
        return True


def save_fundamental_data(conn, type, redownload=False):  # type report_data
    year, quarter, data = 1992, 1, None
    while True:
        try:
            if not is_fundamental_update(conn, type):
                if not is_fundamental_save(conn, year, quarter, type):
                    data = share_tool.get_fundamental_data(year, quarter, type)
                    util.insert(conn, "fundamental_update_log",
                                {"year": str(year), "quarter": str(quarter), "type": str(type)})
                    conn.commit()
            else:
                if redownload is False:
                    year = get_fundamental_year(conn, type)
                    quarter = get_fundamental_quarter(conn, type)
                break
        except Exception as e:
            print(type + "初始年季" + str(year) + "," + str(quarter) + "发生异常:\n")
            print(e)
            if 4 == quarter:
                year += 1
                quarter = 1
            else:
                quarter += 1
    while True:
        try:
            if 4 == quarter:
                year += 1
                quarter = 1
            else:
                quarter += 1
            if int(util.get_now_year()) < year:
                print(type + "已更新到最新")
                return
            # print(data)
            # 保存dataframe数据至库表
            if not is_fundamental_save(conn, year, quarter, type):
                data = share_tool.get_fundamental_data(year, quarter, type)
                util.save_dataframe(conn=conn, data=data, table_name=type, primary_key="code,year,quarter",
                                    save_index=False)
                util.insert(conn, "fundamental_update_log",
                            {"year": str(year), "quarter": str(quarter), "type": str(type)})
                conn.commit()
        except Exception as e:
            print(type + "更新年季" + str(year) + "," + str(quarter) + "发生异常:\n")
            print(e)


def get_share(conn, code, autype):
    save_share(conn, code, autype)
    result = util.execute(conn, "select * from hfq_share where code = " + code)
    # print(result)

def get_index_share(conn,code):
    save_index_share(conn, code)
    result = util.execute(conn, "select * from hfq_index_share where code = " + code)
    # print(result)


def get_search(conn):
    result = util.execute(conn, "select code,concat(name,'(',code,')') from stock_basics order by code;")
    return result


def get_hfq_share(conn, code):
    result = util.execute(conn,
                          "select DATE_FORMAT(date,'%Y-%m-%d'),open,high,close,low,volume,amount,code  from tmp_hfq_share where code = '" + code + "'")
    return result


def init_update_log(conn):
    cursor = conn.cursor()
    if not util.is_table_exist(conn, table_name="update_log"):
        sql = "CREATE TABLE `update_log` (\
                  `code` varchar(6) DEFAULT NULL,\
                  `begin_date` datetime DEFAULT NULL,\
                  `end_date` datetime DEFAULT NULL,\
                  `type` varchar(6) DEFAULT NULL,\
                  UNIQUE KEY `unique_key` (`code`,`type`)\
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;\
                "
        cursor.execute(sql)
        print("初始化表格update_log")


def ma(list, x):
    tmp = [0] * len(list)
    for i in range(x):
        for j in range(len(tmp)):
            if j - i >= 0:
                tmp[j] = tmp[j] + list[j - i]
    for i in range(len(tmp)):
        if i < x - 1:
            tmp[i] = None
        else:
            tmp[i] = tmp[i] / x
    return tmp
