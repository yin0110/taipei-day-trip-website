from crypt import methods
from sqlite3 import connect
import mysql.connector.pooling
from database import pool
import mysql.connector
from flask import *
usrRoot = Blueprint("usrRoot", __name__)


# @usrRoot.route("/api/usr", methods=['POST', 'GET'])
# def accessMethod():
#     if request.method == "POST":
#         result = usrModel.POST()
#         return usrView.render(result)


class usrModel:
    def GET():
        return "abc"

    def POST(self):
        try:
            if request.method == "POST":
                name = request.form["name"]
                email = request.form["email"]
                password = request.form["password"]
                cnx = pool.get_connection()
                cur = cnx.cursor(dictionary=True)
                cur.execute("SELECT * FROM member WHERE email = %s", (email,))
                account = cur.fetchone()
                if account:
                    cur.close()
                    cnx.close()
                    return "error", 400
                else:
                    cur.execute("INSERT INTO member(name, email, password) VALUES (%s, %s, %s)",
                                (name, email, password,))
                    cnx.commit()
                    cur.close()
                    cnx.close()
                    return "ok"
        except:
            return "errorSql", 500

    def PATCH():
        return "ok"

    def DELETE():
        return "ok"


usrModel = usrModel()


class usrView:
    def render(self, result):
        if result == "error":
            data = jsonify({"error": True,
                            "message": "此電子信箱已存在"
                            })
            return data, 400

        elif result == "errorInternal":
            data = jsonify({"error": True,
                            "message": "內部問題"
                            })
            return data, 500

        else:
            data = jsonify({"ok": True})
            return data, 200


usrView = usrView()
