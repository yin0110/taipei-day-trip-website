from crypt import methods
from sqlite3 import connect
import mysql.connector.pooling
from database import pool
import mysql.connector
from flask import *
import flask

test = Blueprint("test", __name__)


@test.route("/api/usr", methods=['GET', 'POST', 'PATCH', 'DELETE'])
def accessMethod():
    if request.method == "GET":
        return usrModel.GET()
    if request.method == "POST":
        return usrModel.POST()
    if request.method == "PATCH":
        return usrModel.PATCH()
    if request.method == "DELETE":
        return usrModel.DELETE()


class usrModel:
    def GET(self):
        try:
            password = session["password"]
            email = session["email"]
            cnx = pool.get_connection()
            cur = cnx.cursor(dictionary=True)
            cur.execute(
                "SELECT id, name, email FROM member WHERE email = %s AND password = %s", (email, password,))
            info = cur.fetchone()
            if info:
                data = jsonify({"data": info})
                cur.close()
                cnx.close()
                return data, 200
        except:
            return "notlogin", 200

    def POST(self):
        try:
            # name = request.form["name"]
            # email = request.form["email"]
            # password = request.form["password"]
            password = request.args.get("password")
            name = request.args.get("name")
            email = request.args.get("email")
            cnx = pool.get_connection()
            cur = cnx.cursor(dictionary=True)
            cur.execute("SELECT * FROM member WHERE email = %s", (email,))
            account = cur.fetchone()
            if account:
                cur.close()
                cnx.close()
                data = jsonify({"error": True,
                                "message": "此電子信箱已被註冊"
                                })
                return data, 400
            else:
                cur.execute("INSERT INTO member(name, email, password) VALUES (%s, %s, %s)",
                            (name, email, password,))
                cnx.commit()
                cur.close()
                cnx.close()
                data = jsonify({"ok": True})
                return data, 200
        except:
            data = jsonify({"error": True,
                            "message": "內部問題"
                            })
            return data, 500

    def PATCH(self):
        try:
            email = request.args.get("email")
            password = request.args.get("password")
            cnx = pool.get_connection()
            cur = cnx.cursor(dictionary=True)
            cur.execute(
                "SELECT email, password FROM member WHERE email = %s AND password = %s", (email, password,))
            account = cur.fetchone()
            cur.close()
            cnx.close()
            if account:
                session["signin"] = True
                session["email"] = account["email"]
                session["password"] = account["password"]
                data = jsonify({"ok": True})
                return data
            else:
                data = jsonify({"error": True,
                                "message": "帳號密碼錯誤"
                                })
                return data, 400
            # return "ok"
        except:
            data = jsonify({"error": True,
                            "message": "內部問題"
                            })
            return data, 500

    def DELETE(self):
        session.pop("signin", None)
        session.pop("email", None)
        session.pop("password", None)
        data = jsonify({"ok": True})
        return data, 200


usrModel = usrModel()


# class usrView:
#     def render(self, result):
#         if result == "error":
#             data = jsonify({"error": True,
#                             "message": "此電子信箱已存在"
#                             })
#             return data, 400

#         elif result == "ok":
#             data = jsonify({"ok": True})
#             return data, 200

#         else:
#             data = jsonify({"error": True,
#                             "message": "內部問題"
#                             })
#             return data, 500


# usrView = usrView()
