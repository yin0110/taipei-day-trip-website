from unicodedata import category
import urllib.request as re
import json
from flask import Flask, jsonify
import yaml
import mysql.connector

db = yaml.safe_load(open('secret.yaml'))
mydb = mysql.connector.connect(
    host=db["host"],
    user=db["user"],
    password=db["password"],
    database=db["db"]
)

cur = mydb.cursor(dictionary=True)


# 讀取json檔案
src = "tapei-attractions.json"
path = "/Users/yin/Desktop/stage2/taipei-day-trip-website/data/taipei-attractions.json"
with open(path) as attractionsfile:
    lines = json.load(attractionsfile)
    clearInfo = lines["result"]["results"]
with open("data.json", mode="w", encoding="utf-8") as jsonList:
    for spot in clearInfo:
        idNo = str(spot["_id"])
        name = spot["stitle"]
        category = spot["CAT2"]
        description = spot["xbody"]
        address = spot["address"]
        transport = spot["info"]
        mrt = spot["MRT"]
        latitude = spot["latitude"]
        longitude = spot["longitude"]
        imgUrl = spot["file"]
        imgUrl = spot["file"]
        urlNonhttp = imgUrl.split("https://")
        finishImg = []
        for url in urlNonhttp:
            images = url
            if url == "":
                continue
            else:
                images = "http://"+url
                if images.endswith("jpg") == True or images.endswith("JPG") == True or images.endswith("png"):
                    #為了要可以儲存多個images, 先把imagesUrl放在list裡
                    finishImg.append(images)
                else:
                    continue
                data = (
                    {"id": idNo, "name": name, "category": category, "description": description, "address": address,
                     "transport": transport, "mrt": mrt, "latitude": latitude, "longitude": longitude, "images": finishImg})
# 把資料寫進json裡，之後直接開啟mysql，load進資料庫中
        jsonList.write(json.dumps(
            data, indent=4, ensure_ascii=False, separators=(',', ': ')) + (",") + '\n')
        cur.execute(
            "LOAD DATA INFILE 'data.json' INTO TABLE `spots` FIELDS TERMINATED BY ',';")
        mydb.commit()
        cur.close()
