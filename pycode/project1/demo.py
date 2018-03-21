from urllib import request;
import time
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

str = "12346"

print(str[0:4])
def get_html(url):
    try:
        with request.urlopen(url) as f:
            data = f.read()
            return data
    except Exception as e:
        print(e)
        return None


#get_html("http://www.tiku.com/index.html")
