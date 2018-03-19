import util
import time


def get_time_to_market(conn, code):
    timestring = util.get_object(conn, "select timeToMarket from stock_basics where code = " + code)
    return timestring

def get_end_date(conn,code,type):
    ct =util.get_object(conn, "select count(1) from update_log where code = " + code+" and type = "+type)
    if ct == 0 :
        return None
    else :
        return util.get_object(conn, "select end_date from update_log where code = " + code + " and type = " + type)

def init_update_log(conn):
    cursor = conn.cursor()
    if not util.is_table_exist(table_name="update_log"):
        sql = "CREATE TABLE `update_log` (\
                  `code` varchar(6) DEFAULT NULL,\
                  `begin_date` datetime DEFAULT NULL,\
                  `end_date` datetime DEFAULT NULL,\
                  `type` varchar(6) DEFAULT NULL,\
                  UNIQUE KEY `unique_key` (`code`,`type`)\
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;\
                "
        cursor.execute(sql)

def set_update_log(conn,code,type):
    cursor = conn.cursor()
    sql = ""

    begin_date = get_time_to_market(conn, code)
    last_end_date = get_end_date(conn,code,type)
    end_date = util.get_now_day()
    if last_end_date == None:
        #初始数据
        util.insert(conn,"update_log",{"code":code,"begin_date":begin_date,"end_date":end_date,"type":type})
    else:
        #更新数据
        None#TODO
    cursor.close()


def get_stock(conn,code):
    begin_day = get_time_to_market(conn, code)
    end_day = util.get_now_day()

    #log是否最新日期 若否 更新内容
    get_end_date(conn,code,"D")

    #更新log日期







