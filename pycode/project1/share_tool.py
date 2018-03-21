import tushare
import pandas
#增加code列
def get_h_data(code, start=None, end=None, autype='qfq',
               index=False, retry_count=3, pause=0.001, drop_factor=True,in_batch=False):
    data = None
    b_year, e_year = int(start[0:4]), int(end[0:4])
    b_tail, e_tail = start[4:10], end[4:10]
    print(code+"开始分批下载从"+start+"到"+end)
    if in_batch is True and b_year != e_year:
        t_start, t_end,first=None,None,True
        t_year = b_year
        while t_year <= e_year:
            if t_year == int(start[0:4]):
                t_start,t_end = str(t_year)+b_tail,str(t_year)+"-12-31"
            elif t_year!= e_year:
                t_start, t_end = str(t_year) + "-01-01", str(t_year) + "-12-31"
            elif t_year == e_year:
                t_start, t_end = str(t_year) + "-01-01", str(t_year) + e_tail

            tmp = tushare.get_h_data(code, start=t_start, end=t_end, autype=autype,
                                     index=index, retry_count=retry_count, pause=pause, drop_factor=drop_factor)

            if first is True:
                first = False
                data = tmp
            else:
                data = pandas.concat([data,tmp])
            print(code + "已下载批次从" + t_start + "到" + t_end)
            t_year+=1
    else:
        data = tushare.get_h_data(code, start=start, end=end, autype=autype,
                   index=index, retry_count=retry_count, pause=pause, drop_factor=drop_factor)
    data['code']=code
    data['autype']=autype#qfq hfq none
    return data



