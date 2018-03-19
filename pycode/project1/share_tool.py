import tushare
#增加code列
def get_h_data(code, start=None, end=None, autype='qfq',
               index=False, retry_count=3, pause=0.001, drop_factor=True):
    data = tushare.get_h_data(code, start=start, end=end, autype=autype,
               index=index, retry_count=retry_count, pause=pause, drop_factor=drop_factor)
    data['code']=code
    data['autype']=autype#qfq hfq none
    return data

