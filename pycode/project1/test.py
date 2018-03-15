import tushare as ts
import pymysql
import frendy_tool



db = pymysql.connect("localhost","test","199104","testdb")
cursor = db.cursor()
frendy_tool.get_insert_sql(cursor,"day_data")

db.close()

#data = ts.get_k_data('000001',start='2011-01-02',index=True)
#data = ts.get_today_all()
#print(data)

#查找表 若无则上网取数插入本地表

#select COLUMN_NAME from information_schema.COLUMNS where table_name = 'd';

