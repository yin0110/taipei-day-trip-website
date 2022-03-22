from flask import *
usrRoot = Blueprint("usrRoot", __name__)


@usrRoot.route("/api/usr")
def get():
    return "abc"
