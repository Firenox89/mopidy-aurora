from __future__ import absolute_import, unicode_literals

import os

import tornado.web
import tornado.wsgi

from mopidy import ext
from .nanoleaf import Aurora

glogger = ""
def setlogger(logger):
    global glogger
    glogger = logger

class TPOnOffHandler(tornado.web.RequestHandler):
    def initialize(self, database):
        self.database = database

    def put(self):
        data = tornado.escape.json_decode(self.request.body)
        os.system("./tplink_smartplug.py -t 192.168.2.101 -c " + data["on"])

class AuroraOnOffHandler(tornado.web.RequestHandler):
    def initialize(self, database):
        self.database = database

    def put(self):
        data = tornado.escape.json_decode(self.request.body)
        aurora = Aurora("192.168.2.100", "1tHOYr0jYUm2dIlELluQXGAJV97Svqcw")
        aurora.on = data["on"]

def my_app_factory(config, core):
    database = "wtf"
    return [
        (r'/tp/onoff', TPOnOffHandler, dict(database = database)),
        (r'/aurora/onoff', AuroraOnOffHandler, dict(database = database)),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': '/home/firenox/git/mopidy-aurora/aurora-react/build/', "default_filename": "index.html"}),
    ]

