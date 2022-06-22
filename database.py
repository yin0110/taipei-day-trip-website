from flask import *
import mysql.connector.pooling
import yaml

db = yaml.safe_load(open('secret.yaml'))
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool",
                                                   pool_size=10,
                                                   host=db["host"],
                                                   user=db["user"],
                                                   password=db["password"],
                                                   database=db["db"])
