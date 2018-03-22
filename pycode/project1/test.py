import tushare
import pymysql
import numpy
import share_tool
import time
import util
import business
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

# util.save_dataframe(conn=conn, data=share_data, table_name="stock_basics", primary_key="code",save_index=True)

# share_data = tushare.get_h_data('000001', start='2018-02-27', index=True)
# print(share_data)
"""
list = [1,2,3,4,5,6,7,8,9,10]
ma_list = business.ma(list,5)
print(ma_list)
"""
# 初始化表格
"""
business.init_update_log(conn)
share_data = tushare.get_stock_basics()
util.save_dataframe(conn=conn, data=share_data, table_name="stock_basics", primary_key="code",save_index=True)
print(share_data)
"""



#code_list = util.execute(conn,"select code from stock_basics where code not in (select code from update_log) order by code")
code_list = util.execute(conn,"select code from stock_basics where code not in (select code from update_log) order by code desc")
for row in code_list:
    code = row[0]
    if int(code) >= 603598:
        continue
    for i in range(1):
        try:
            business.get_share(conn, code, "hfq")
        except Exception:
            print("!!!警告:下载"+code+"发生异常");
            #print("开始睡眠"+str(60+30*i)+"s")
            #time.sleep(60+30*i)
            #print("重新下载"+code+",第"+str(i+1)+"次")




# share_data = tushare.get_k_data('000001', start='2011-02-27', index=True,)
# 日获取
#  share_data = share_tool.get_h_data('000001', start='2018-02-27', index=True)
# util.save_dataframe(conn=conn, data=share_data, table_name="hello", primary_key="date,code,autype")


# print(share_data)
# share_list = numpy.array(share_data).tolist()


conn.commit()
conn.close()

# data = ts.get_k_data('000001',start='2011-01-02',index=True)
# data = ts.get_today_all()
# print(data)

# 查找表 若无则上网取数插入本地表

# select COLUMN_NAME from information_schema.COLUMNS where table_name = 'd';
