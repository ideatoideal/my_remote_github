from urllib import request;
import time
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

str = "12346"

print("开始")
for i in range(3):
    try:
        if i == 2:
            break

        print("exception")
        raise Exception("Invalid level!")
    except Exception:
        print("哈哈")
print("完成")

print(str[0:4])


def get_html(url):
    try:
        with request.urlopen(url) as f:
            data = f.read()
            return data
    except Exception as e:
        print(e)
        return None

# get_html("http://www.tiku.com/index.html")
