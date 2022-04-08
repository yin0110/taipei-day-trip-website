from crypt import methods
from sqlite3 import connect
from database import pool
import mysql.connector.pooling
import mysql.connector
from flask import *
import flask
import requests
import datetime

order_number=None
def get_order_no():
    curret_time=datetime.datetime.now()
    year=curret_time.year
    year=year*10**10
    month=curret_time.month
    month=month*10**8
    day=curret_time.day
    day=day*10**6
    hour=curret_time.hour
    hour=hour*10**4
    minute=curret_time.minute
    minute=minute*10**2
    sec=curret_time.second
    global order_number
    order_number=year+month+day+hour+minute+sec
    return order_number
    

order_API = Blueprint("order_API", __name__)

@order_API.route("/api/orders", methods=["POST"])
def order():
    if request.method == "POST":
        return order_model.POST()
    
@order_API.route("/api/order/<orderNumber>", methods=["GET"])
def order_no(orderNumber):
    if request.method == "GET":
            return order_model.GET(orderNumber)


class order_model:
    def GET(self, orderNumber):
        if "signin" in session:
            try:
                order_number = orderNumber
                cnx = pool.get_connection()
                cur = cnx.cursor(dictionary=True)
                cur.execute("SELECT number, price, orderAttraction, name, address, image, date, time, contactPerson, contactEmail, contactPhone FROM booking JOIN spots on orderAttraction=spots.id WHERE number=%s",
                            (order_number,))
                order_info=cur.fetchone()
                print(order_info)
                cur.close()
                cnx.close()
                data={"number":order_info["number"], "price":order_info["price"], "trip":{
                    "attraction":{
                        "id":order_info["orderAttraction"],
                        "name":order_info["name"],
                        "address":order_info["address"],
                        "image":order_info["image"]
                    },
                    "date":order_info["date"],
                    "time":order_info["time"]   
                    },
                    "contact":{
                        "name":order_info["contactPerson"],
                        "email": order_info["contactEmail"],
                        "phone": order_info["contactPhone"]
                    },
                    "status":0}
                data=jsonify({"data":data})
                return data, 200
            except:
                data = jsonify({"error": True,
                                "message": "請輸入正確訂單"
                                })
                return data, 500
        else:
            data=jsonify({
            "error": True,
            "message": "請登入帳號"
            })
            return data, 403

        
        
    def POST(self):
        if "signin" in session:
            try:
                requestInfo = request.get_json(force=True)
                date = requestInfo["date"]
                time = requestInfo["time"]
                attraction_id = requestInfo["attractionId"]
                attraction_name= requestInfo["name"]
                address=requestInfo["address"]
                image=requestInfo["image"]
                price = requestInfo["price"]
                contact_name=requestInfo["contactName"]
                contact_email=requestInfo["email"]
                contact_phone=requestInfo["phone"]
                prime=requestInfo["prime"]
                orderPerson=session["email"]
                
                post_data={
                    "prime":prime,
                    "partner_key": "partner_ubzTrnfftSK7Qpg1xOxZxXyKWmyMlZwzCtgp7cp808hYv3iZtqbNzFk3",
                    "merchant_id": "yin0110_TAISHIN",
                    "details":"TapPay Test",
                    "amount": price,
                    "cardholder": {
                        "phone_number": contact_phone,
                        "name": contact_name,
                        "email": contact_email
                    },
                    "remember": True
                }
                url='https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
                headers= {'x-api-key': 'partner_ubzTrnfftSK7Qpg1xOxZxXyKWmyMlZwzCtgp7cp808hYv3iZtqbNzFk3',
                        'Content-Type': 'application/json'}
                #如果不是用json=post_data, 而是用data=post_data, 對方的api沒辦法接收
                res = requests.post(url, json=post_data, headers=headers)
                response_json=json.loads(res.text)
                # print(response_json)
                if response_json["status"]==0:
                    get_order_no()
                    po_number= order_number
                    payment_Info={
                    "number": po_number,"payment": {
                    "status": 0,
                    "message": "付款成功"
                    }}
                    data= jsonify({"data": payment_Info})
                    cnx = pool.get_connection()
                    cur = cnx.cursor(dictionary=True)
                    cur.execute("INSERT INTO booking(prime, orderAttraction, image, date, time, price, contactPerson, contactEmail, contactPhone, orderEmail, number) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                            (prime, attraction_id, image, date, time, price, contact_name, contact_email, contact_phone, orderPerson, po_number,))
                    cnx.commit()
                    cur.close()
                    cnx.close()
                    return data, 200
                else:
                    data=jsonify({
                    "error": True,
                    "message": "付款失敗"
                    })
                    return data, 400
    
            except:
                data = jsonify({"error": True,
                                "message": "內部問題"
                                })
                return data, 500
        else:
            data=jsonify({
            "error": True,
            "message": "請登入帳號"
            })
            return data, 403



order_model = order_model()