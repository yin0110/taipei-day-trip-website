from crypt import methods
from sqlite3 import connect
import mysql.connector.pooling
from database import pool
import mysql.connector
from flask import *
import flask
from model import usrModel
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
