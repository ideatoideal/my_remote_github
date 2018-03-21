import util
import time
import tushare
import share_tool


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


def get_share(conn, code, autype):
    save_share(conn, code, autype)
    result = util.execute(conn, "select * from hfq_share where code = " + code)
    #print(result)


def init_update_log(conn):
    cursor = conn.cursor()
    if not util.is_table_exist(conn,table_name="update_log"):
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
            if j - i >= 0 :
                tmp[j] = tmp[j] + list[j - i]
    for i in range(len(tmp)):
        if i < x - 1:
            tmp[i] = None
        else:
            tmp[i] = tmp[i] / x
    return tmp
