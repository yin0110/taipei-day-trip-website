from unicodedata import category
import mysql.connector
import urllib.request as re
import json
import yaml
from crypt import methods
from webbrowser import get
from flask import Flask, jsonify
from flask import request


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
# 避免自動排序
app.config['JSON_SORT_KEYS'] = False

# 資料庫建立
db = yaml.safe_load(open('secret.yaml'))
mydb = mysql.connector.connect(
    host=db["host"],
    user=db["user"],
    password=db["password"],
    database=db["db"]
)

cur = mydb.cursor(dictionary=True)

# # 讀取json檔案
# src = "tapei-attractions.json"
# path = "/Users/yin/Desktop/stage2/taipei-day-trip-website/data/taipei-attractions.json"
# with open(path) as attractionsfile:
#     lines = json.load(attractionsfile)
#     clearInfo = lines["result"]["results"]
# with open("data.json", mode="w", encoding="utf-8") as jsonList:
#     for spot in clearInfo:
#         idNo = str(spot["_id"])
#         name = spot["stitle"]
#         category = spot["CAT2"]
#         description = spot["xbody"]
#         address = spot["address"]
#         transport = spot["info"]
#         mrt = spot["MRT"]
#         latitude = spot["latitude"]
#         longitude = spot["longitude"]
#         imgUrl = spot["file"]
#         imgUrl = spot["file"]
#         urlNonhttp = imgUrl.split("https://")
#         finishImg = []
#         for url in urlNonhttp:
#             images = url
#             if url == "":
#                 continue
#             else:
#                 images = "http://"+url
#                 if images.endswith("jpg") == True or images.endswith("JPG") == True or images.endswith("png"):
#                     #為了要可以儲存多個images, 先把imagesUrl放在list裡
#                     finishImg.append(images)
#                 else:
#                     continue
#         data = (
#             {"id": idNo, "name": name, "category": category, "description": description, "address": address,
#              "transport": transport, "mrt": mrt, "latitude": latitude, "longitude": longitude, "images": finishImg})
# # 把資料寫進json裡，之後直接開啟mysql，load進資料庫中
# jsonList.write(json.dumps(
#     data, indent=4, ensure_ascii=False, separators=(',', ': ')) + (",") + '\n')


@app.route('/api/attraction', methods=["GET"])
def attraction():
    attractionid = request.args.get("attractionid")
    cur.execute(
        "SELECT images FROM spots WHERE id=%s", (attractionid,))
    # type dict
    attractionImg = cur.fetchone()
    if attractionImg:
        attractionImgstring = attractionImg["images"]
        # print(type(attractionImglist)) type string
        attractionImglist = eval(attractionImgstring)
        attractionImglist = {"images": attractionImglist}
        cur.execute(
            "SELECT id, name, category, description, address, transport, mrt, latitude, longitude FROM spots WHERE id=%s",
            (attractionid,))
        attractionInfo = cur.fetchone()
        attractionInfo.update(attractionImglist)
        data = jsonify({"data": attractionInfo})
        data.headers.add("Content-Type", "application/json")
        data.headers.add("Access-Control-Allow-Origin", "*")
        # attractionInfo = json.dumps(
        #     {"data": attractionInfo}, ensure_ascii=False, indent=4)
        return data
    else:
        data = {
            "error": True,
            "message": "無此訊息"
        }
        data = jsonify(data)
        data.headers.add("Content-Type", "application/json")
        data.headers.add("Access-Control-Allow-Origin", "*")
        return data, 500


app.run(port=3000, debug=True)
