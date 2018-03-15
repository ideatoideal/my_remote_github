def get_insert_sql(cursor,tbname):
    sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '"+tbname+"'";
    cursor.execute(sql)
    #http://blog.csdn.net/guofeng93/article/details/53994112
    data = cursor.fetchall()
    print(data)