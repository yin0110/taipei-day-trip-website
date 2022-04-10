from crypt import methods
from sqlite3 import connect
import mysql.connector.pooling
from database import pool
import mysql.connector
from flask import *
import flask


booking = Blueprint("booking", __name__)


@booking.route("/api/booking", methods=['GET', 'POST', 'DELETE'])
def accessMethod():
    if request.method == "GET":
        return booking_model.GET()
    if request.method == "POST":
        return booking_model.POST()
    if request.method == "DELETE":
        return booking_model.DELETE()


class booking_model:
    def GET(self):
        if "signin" in session:
            if "booking_id" in session:
                booking_id = session["booking_id"]
                cnx = pool.get_connection()
                cur = cnx.cursor(dictionary=True)
                cur.execute(
                    "SELECT spots.id, name, address, images FROM spots JOIN item ON attractionId=spots.id WHERE item=%s",
                    (booking_id,))
                attraction_info = cur.fetchone()
                imgLst = eval(attraction_info["images"])
                attraction_info.pop("images", None)
                attraction_info["images"] = imgLst[0]
                attraction_info = {"attraction": attraction_info}
                cur.execute(
                    "SELECT date, time, price FROM spots JOIN item ON attractionId=spots.id WHERE item=%s",
                    (booking_id,))
                booking_info = cur.fetchone()
                attraction_info.update(booking_info)
                data = jsonify({"data": attraction_info})
                cur.close()
                cnx.close()
                return data, 200
            else:
                data = jsonify({"message": "目前沒有任何預定行程"
                                })
                return data, 200
        else:
            data = jsonify({"error": True,
                            "message": "未登入系統，拒絕存取"
                            })
            return data, 403

    def POST(self):
        try:
            if "signin" in session:
                requestInfo = request.get_json(force=True)
                date = requestInfo["date"]
                time = requestInfo["time"]
                attraction_id = requestInfo["attractionId"]
                price = requestInfo["price"]
                if attraction_id == "" or date == "" or price == "" or time == "":
                    data = jsonify({"error": True,
                                    "message": "請輸入全部資訊"
                                    })
                    return data, 400
                else:
                    session["attraction_id"] = attraction_id
                    cnx = pool.get_connection()
                    cur = cnx.cursor(dictionary=True)
                    cur.execute("INSERT INTO item(attractionId, date, time, price) VALUES (%s, %s, %s, %s)",
                                (attraction_id, date, time, price,))
                    cnx.commit()
                    booking_id = cur.lastrowid
                    session["booking_id"] = booking_id
                    cur.close()
                    cnx.close()
                    data = jsonify({"ok": True})
                return data, 200
            else:
                data = jsonify({"error": True,
                                "message": "未登入系統，拒絕存取"
                                })
                return data, 403
        except:
            data = jsonify({"error": True,
                            "message": "內部問題"
                            })
            return data, 500
    # def POST(self):
    #     try:
    #         if "signin" in session:
    #             requestInfo = request.get_json(force=True)
    #             attraction_id = request.args.get("attractionId")
    #             date = request.args.get("date")
    #             time = request.args.get("time")
    #             price = request.args.get("price")
    #             if attraction_id == "" or date == "" or price == "" or time == "":
    #                 data = jsonify({"error": True,
    #                                 "message": "請輸入全部資訊"
    #                                 })
    #                 return data, 400
    #             else:
    #                 session["attraction_id"] = attraction_id
    #                 cnx = pool.get_connection()
    #                 cur = cnx.cursor(dictionary=True)
    #                 cur.execute("INSERT INTO item(attractionId, date, time, price) VALUES (%s, %s, %s, %s)",
    #                             (attraction_id, date, time, price,))
    #                 cnx.commit()
    #                 booking_id = cur.lastrowid
    #                 session["booking_id"] = booking_id
    #                 cur.close()
    #                 cnx.close()
    #                 data = jsonify({"ok": True})
    #             return data, 200
    #         else:
    #             data = jsonify({"error": True,
    #                             "message": "未登入系統，拒絕存取"
    #                             })
    #             return data, 403
    #     except:
    #         data = jsonify({"error": True,
    #                         "message": "內部問題"
    #                         })
    #         return data, 500

    def DELETE(self):
        booking_id = session["booking_id"]
        cnx = pool.get_connection()
        cur = cnx.cursor(dictionary=True)
        cur.execute("DELETE FROM item WHERE item= %s",
                    (booking_id,))
        cnx.commit()
        session.pop("booking_id", None)
        data = jsonify({"ok": True})
        cur.close()
        cnx.close()
        return data, 200


booking_model = booking_model()
