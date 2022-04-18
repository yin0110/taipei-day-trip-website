from crypt import methods
from sqlite3 import connect
from flask import *
from model import usrModel
member_API = Blueprint("member_API", __name__)


@member_API.route("/api/usr", methods=['GET', 'POST', 'PATCH', 'DELETE'])
def accessMethod():
    if request.method == "GET":
        return usrModel.GET()
    if request.method == "POST":
        return usrModel.POST()
    if request.method == "PATCH":
        return usrModel.PATCH()
    if request.method == "DELETE":
        return usrModel.DELETE()
