from crypt import methods
from sqlite3 import connect
from database import pool, db
import mysql.connector
from flask import *
import requests
import datetime

order_number = None


def get_order_no():
    curret_time = datetime.datetime.now()
    year = curret_time.year
    year = year*10**10
    month = curret_time.month
    month = month*10**8
    day = curret_time.day
    day = day*10**6
    hour = curret_time.hour
    hour = hour*10**4
    minute = curret_time.minute
    minute = minute*10**2
    sec = curret_time.second
    global order_number
    order_number = year+month+day+hour+minute+sec
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
                order_info = cur.fetchone()
                data = {"number": order_info["number"], "price": order_info["price"], "trip": {
                    "attraction": {
                        "id": order_info["orderAttraction"],
                        "name": order_info["name"],
                        "address": order_info["address"],
                        "image": order_info["image"]
                    },
                    "date": order_info["date"],
                    "time": order_info["time"]
                },
                    "contact": {
                        "name": order_info["contactPerson"],
                        "email": order_info["contactEmail"],
                        "phone": order_info["contactPhone"]
                },
                    "status": 0}
                data = jsonify({"data": data})
                return data, 200
            except:
                data = jsonify({"error": True,
                                "message": "請輸入正確訂單"
                                })
                return data, 500
            finally:
                cur.close()
                cnx.close()
        else:
            data = jsonify({
                "error": True,
                "message": "請登入帳號"
            })
            return data, 403

    def POST(self):
        if "signin" in session:
            try:
                request_info = request.get_json(force=True)
                date = request_info["date"]
                time = request_info["time"]
                attraction_id = request_info["attractionId"]
                image = request_info["image"]
                price = request_info["price"]
                contact_name = request_info["contactName"]
                contact_email = request_info["email"]
                contact_phone = request_info["phone"]
                prime = request_info["prime"]
                order_person = session["email"]

                post_data = {
                    "prime": prime,
                    "partner_key": db["partner_key"],
                    "merchant_id": db["merchant_id"],
                    "details": "TapPay Test",
                    "amount": price,
                    "cardholder": {
                        "phone_number": contact_phone,
                        "name": contact_name,
                        "email": contact_email
                    },
                    "remember": True
                }
                url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
                headers = {'x-api-key': 'partner_ubzTrnfftSK7Qpg1xOxZxXyKWmyMlZwzCtgp7cp808hYv3iZtqbNzFk3',
                           'Content-Type': 'application/json'}
                #如果不是用json=post_data, 而是用data=post_data, 對方的api沒辦法接收
                res = requests.post(url, json=post_data, headers=headers)
                response_json = json.loads(res.text)

                if response_json["status"] == 0:
                    get_order_no()
                    po_number = order_number
                    payment_Info = {
                        "number": po_number, "payment": {
                            "status": 0,
                            "message": "付款成功"
                        }}
                    data = jsonify({"data": payment_Info})
                    cnx = pool.get_connection()
                    cur = cnx.cursor(dictionary=True)
                    cur.execute("INSERT INTO booking(prime, orderAttraction, image, date, time, price, contactPerson, contactEmail, contactPhone, orderEmail, number) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                                (prime, attraction_id, image, date, time, price, contact_name, contact_email, contact_phone, order_person, po_number,))
                    cnx.commit()
                    return data, 200
                else:
                    data = jsonify({
                        "error": True,
                        "message": "付款失敗"
                    })
                    return data, 400

            except:
                data = jsonify({"error": True,
                                "message": "內部問題"
                                })
                return data, 500
            finally:
                if cnx.in_transaction:
                    cnx.rollback()
                cur.close()
                cnx.close()
        else:
            data = jsonify({
                "error": True,
                "message": "請登入帳號"
            })
            return data, 403


order_model = order_model()
