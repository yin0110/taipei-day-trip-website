import string
import numpy as np
import math
from unicodedata import category
import mysql.connector
import urllib.request as re
import json
from sqlalchemy import null
import yaml
import ast
from crypt import methods
from webbrowser import get
from flask import Flask, jsonify
from flask import request


from flask import *
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
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

# Pages


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


@app.route('/api/attraction/<attractionId>', methods=["GET"])
def spots(attractionId):
    attractionid = attractionId
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
        # type(attractionInfo) dic
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
        return data, 400


@app.route('/api/attraction', methods=["GET"])
def spotspage():
    perpage = 12
    page = request.args.get("page")
    keyword = request.args.get("keyword")
    try:
        page = int(page)
    except:
        data = {
            "error": True,
            "message": "請輸入正確頁碼數字"
        }
        return data, 400

    if keyword:
        try:
            cur.execute("SELECT COUNT(*) FROM spots WHERE name Like %s", ("%{}%".format(
                        keyword),))
            dataQty = cur.fetchone()
            Qty = dataQty["COUNT(*)"]
            maxPage = math.ceil(Qty/perpage)
            if page < maxPage:
                startdata = page*perpage
                next_page = page + 1
                if next_page < maxPage:
                    next_page = page + 1
                else:
                    next_page = "null"
                cur.execute(
                    "SELECT * FROM spots WHERE name Like %s limit %s,%s;", ("%{}%".format(
                        keyword), startdata, perpage))
                # limit %s, %s;", (startdata, perpage)
                # WHERE name Like '%館%'
                attractionInfo = cur.fetchall()
                fullData = []
                for spot in attractionInfo:
                    imgStr = spot["images"]
                    imgLst = eval(imgStr)
                    spot.pop("images", None)
                    spot["images"] = imgLst
                    fullData.append(spot)
                    data = {"nextPage": next_page, "data": fullData}
                return data
            else:
                data = {
                    "error": True,
                    "message": "無此頁面"
                }
                return data, 400
        except:
            data = {
                "error": True,
                "message": "內部問題"
            }
            return data, 500
    else:
        try:
            cur.execute("SELECT COUNT(*) FROM spots")
            dataQty = cur.fetchone()
            Qty = dataQty["COUNT(*)"]
            maxPage = math.ceil(Qty/perpage)
            print(type(page))
            if page < maxPage:
                startdata = page*perpage
                next_page = page + 1
                if next_page < maxPage:
                    next_page = page + 1
                else:
                    next_page = "null"
                cur.execute(
                    "SELECT * FROM spots limit %s, %s;", (startdata, perpage))
                attractionInfo = cur.fetchall()
                print(attractionInfo)
                fullData = []
                for spot in attractionInfo:
                    imgStr = spot["images"]
                    imgLst = eval(imgStr)
                    spot.pop("images", None)
                    spot["images"] = imgLst
                    # fullDatalist = {"nextPage": next_page, "data": spot}
                    fullData.append(spot)
                    data = {"nextPage": next_page, "data": fullData}
                return data
            else:
                data = {
                    "error": True,
                    "message": "無此頁面"
                }
                return data, 400
        except:
            data = {
                "error": True,
                "message": "內部問題"
            }
            return data, 500


app.run(host='0.0.0.0', port=3000)
