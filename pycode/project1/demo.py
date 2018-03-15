from urllib import request;



def get_html(url):
    try:
        with request.urlopen(url) as f:
            data = f.read()
            return data
    except Exception as e:
        print(e)
        return None


get_html("http://www.tiku.com/index.html")
