import time
import calendar

def execute(conn,sql):
    cursor = conn.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    return result

def insert(conn, table_name, dict):
    cursor = conn.cursor()
    columns = []
    values = []
    for key in dict.keys():
        columns.append(key)
        values.append("'"+dict[key]+"'")
    columns = ",".join(columns)
    values = ",".join(values)
    sql = "insert ignore into " + table_name + "(" + columns + ") values (" + values + ")"
    print(sql)
    cursor.execute(sql)
    cursor.close()


def update(conn, table_name, dict, dict2):
    cursor = conn.cursor()
    p1, p2 = [], []
    for key in dict.keys():
        p1.append(key + "='" + dict[key] + "'")
    for key2 in dict2.keys():
        p2.append(key2 + "='" + dict2[key2] + "'")
    p1 = ",".join(p1)
    p2 = " and ".join(p2)
    sql = "update " + table_name + " set " + p1 + " where " + p2
    cursor.execute(sql)
    print(sql)
    cursor.close()


def timestring_to_day(timestring):
    tmp = time.strptime(timestring, '%Y-%m-%d %H:%M:%S')
    return time.strftime('%Y-%m-%d', tmp)


def get_now_time():
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))


def get_now_day():
    return time.strftime('%Y-%m-%d', time.localtime(time.time()))


def get_insert_sql(cursor, tbname):
    sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '" + tbname + "'";
    cursor.execute(sql)
    # http://blog.csdn.net/guofeng93/article/details/53994112
    data = cursor.fetchall()
    print(data)


def get_object(conn, sql):
    cursor = conn.cursor()
    cursor.execute(sql)
    ret = cursor.fetchall()
    cursor.close()
    for r in ret:
        return r[0]



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


def get_column_large_len(column):
    length = 0
    tmp_len = 0
    for value in column:
        tmp_len = len(str(value))
        if length < tmp_len: length = tmp_len
    return length


def is_table_exist(conn, table_name):
    cursor = conn.cursor()
    sql = "SELECT count(1) FROM information_schema.TABLES WHERE table_name ='" + table_name + "';"
    cursor.execute(sql)
    ret = cursor.fetchall()
    has_table = False
    for r in ret:
        has_table = True if (r[0] != 0) else False
    cursor.close()
    return has_table


def save_dataframe(conn, data, table_name, primary_key, truncate=False, save_index=False):
    """
    :param conn: 连接
    :param data: dataframe的数据
    :param table_name: 保存表名
    :param primary_key: 主键 例如"name,age"
    :param truncate: 保存前是否先truncate表格
    :param save_index: 是否保存inde数据
    :return:
    """
    cursor = conn.cursor()
    # 查询表格是否存在
    has_table = is_table_exist(conn, table_name)

    # 构建建表所需字段
    name_list = list(data)
    type_list = data.dtypes
    columns = []
    if save_index:
        if str(data.index.dtype) == "object":
            length = get_column_large_len(data.index.values)
            columns.append(data.index.name + " varchar(" + str(length) + ")")
        else:
            columns.append(data.index.name + " " + transform_type(str(data.index.dtype)))
    for i in range(len(name_list)):
        if str(type_list[i]) == "object":
            length = get_column_large_len(data[name_list[i]].values)
            columns.append(name_list[i] + " varchar(" + str(length) + ")")
        else:
            columns.append(name_list[i] + " " + transform_type(str(type_list[i])))
    columns = ",".join(columns)
    if has_table:
        if truncate:
            sql = "truncate table " + table_name
            print(sql)
            cursor.execute(sql)
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

    if save_index:
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
        if save_index:
            tmp_row.append(str(index_list[i]))
        for j in range(len(data_list[i])):
            tmp_row.append(str(data_list[i][j]))
        merge_list.append(tmp_row)
    # data_list = numpy.concatenate( ( numpy.array(data.index)[:,None],numpy.array(data) ),axis=1 )
    cursor.executemany(sql, merge_list)
    cursor.close()
