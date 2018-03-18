import tushare
import pymysql
import numpy
import frendy_tool
from warnings import filterwarnings

filterwarnings('ignore', category=pymysql.Warning)  # 去掉warning信息


def transform_type(str):
    types = {
        "float": "double",
        "int": "bigint",
        "datetime": "datetime",
        "date": "datetime",
        "": "乜嘢都无"
    }
    for key in types.keys():
        if key in str:
            return types.get(key)


def save_data(conn, data, table_name, primary_key):
    cursor = conn.cursor()
    # 查询表格是否存在
    sql = "SELECT count(1) FROM information_schema.TABLES WHERE table_name ='" + table_name + "';"
    cursor.execute(sql)
    ret = cursor.fetchall()
    name_list = list(data)
    type_list = data.dtypes
    columns = []
    columns.append(data.index.name + " " + transform_type(str(data.index.dtype)))
    for i in range(len(name_list)):
        columns.append(name_list[i] + " " + transform_type(str(type_list[i])))
    columns = ",".join(columns)
    has_table = True
    for r in ret:
        has_table = True if (r[0] != 0) else False
    if not has_table:  # 建表
        sql = "create table " + table_name + "(" + columns
        if primary_key is not None:
            sql += " ,primary key(" + primary_key + ")"
        sql += ") "
        print(sql)
        cursor.execute(sql)
    # 不重复插入
    columns = []
    values = []
    columns.append(data.index.name)
    values.append("%s")
    for i in range(len(name_list)):
        values.append("%s")
        columns.append(name_list[i])
    columns = ",".join(columns)
    values = ",".join(values)
    sql = "insert ignore " + table_name + "(" + columns + ") values(" + values + ")"
    print(sql)
    data_list = data.values
    index_list = data.index.values
    merge_list = []
    for i in range(len(data_list)):
        tmp_row = []
        tmp_row.append(str(index_list[i]))
        for j in range(len(data_list[i])):
            tmp_row.append(str(data_list[i][j]))
        merge_list.append(tmp_row)
    #data_list = numpy.concatenate( ( numpy.array(data.index)[:,None],numpy.array(data) ),axis=1 )
    cursor.executemany(sql,merge_list)
    cursor.close()


conn = pymysql.connect("localhost", "test", "199104", "testdb")
cursor = conn.cursor()
sql = frendy_tool.get_insert_sql(cursor, "day_data")

# 接口返回DataFrame类型 详情百度panda库
# get_today_all 获取今日数据
# get_today_ticks 获取当前粉笔记录
# get_tick_data 分笔记录
# get_h_data 前复权
# get_sina_dd 大单 默认大于400手

share_data = tushare.get_h_data('000001', start='2018-02-27', index=True)

# share_data = tushare.get_stock_basics()
save_data(conn=conn, data=share_data, table_name="hello", primary_key="date")

print(share_data)
# print(share_data)
# share_list = numpy.array(share_data).tolist()

try:
    str = None
    # cursor.executemany(sql,share_list)
except Exception as e:
    print("执行MySQL: % s时出错： % s" % (sql, e))
finally:
    cursor.close()
    conn.commit()
    conn.close()

# data = ts.get_k_data('000001',start='2011-01-02',index=True)
# data = ts.get_today_all()
# print(data)

# 查找表 若无则上网取数插入本地表

# select COLUMN_NAME from information_schema.COLUMNS where table_name = 'd';
