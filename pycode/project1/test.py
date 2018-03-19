import tushare
import pymysql
import numpy
import share_tool
import util
from warnings import filterwarnings
filterwarnings('ignore', category=pymysql.Warning)  # 去掉warning信息



conn = pymysql.connect("localhost", "test", "199104", "testdb", use_unicode=True, charset="utf8")  # 默认utf-8 不然插入可能会出错
cursor = conn.cursor()

# 接口返回DataFrame类型 详情百度panda库
# get_today_all 获取今日数据
# get_today_ticks 获取当前分笔记录
# get_tick_data 分笔记录
# get_h_data 默认qfq
# get_sina_dd 大单 默认大于400


# 基本 TODO及时更新数据
#share_data = tushare.get_stock_basics()
#util.save_data(conn=conn, data=share_data, table_name="stock_basics", primary_key="code")




#share_data = tushare.get_k_data('000001', start='2011-02-27', index=True,)
# 日获取
#  share_data = share_tool.get_h_data('000001', start='2018-02-27', index=True)
# util.save_data(conn=conn, data=share_data, table_name="hello", primary_key="date,code,autype")

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
