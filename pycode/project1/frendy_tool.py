def get_insert_sql(cursor, tbname):
    sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '" + tbname + "'";
    cursor.execute(sql)
    # http://blog.csdn.net/guofeng93/article/details/53994112
    data = cursor.fetchall()
    data = list(data)
    columns = ""
    columns = []
    values = []
    for row in data:
        columns.append(row[0])
        values.append("%s")
    columns = ",".join(columns)
    values = ",".join(values)
    # print(data);
    sql = "insert ignore " + tbname + "(" + columns + ") values(" + values + ")"
    print(sql)
    return sql
