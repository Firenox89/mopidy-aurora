from __future__ import absolute_import, unicode_literals

import os

import tornado.web
import tornado.wsgi

from mopidy import ext
from .nanoleaf import Aurora

aurora = Aurora("192.168.2.100", "1tHOYr0jYUm2dIlELluQXGAJV97Svqcw")
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
    def get(self):
        data = tornado.escape.json_encode(aurora.on)
        self.write(data)

    def put(self):
        data = tornado.escape.json_decode(self.request.body)
        aurora.on = data["on"]

class AuroraEffectHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(aurora.effect)

    def put(self):
        aurora.effect = self.request.body

class AuroraBrightnessHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(aurora.brightness))

    def put(self):
        aurora.brightness = int(self.request.body)

class AuroraEffectListHandler(tornado.web.RequestHandler):
    def get(self):
        data = tornado.escape.json_encode(aurora.effects_list)
        self.write(data)


def app_factory(config, core):
    database = "wtf"
    auroraPath = os.path.join(os.path.dirname(__file__), 'static')
    return [
        (r'/tp/onoff', TPOnOffHandler, dict(database = database)),
        (r'/aurora/on', AuroraOnOffHandler),
        (r'/aurora/effect', AuroraEffectHandler),
        (r'/aurora/effect_list', AuroraEffectListHandler),
        (r'/aurora/brightness', AuroraBrightnessHandler),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': auroraPath, "default_filename": "index.html"}),
    ]

