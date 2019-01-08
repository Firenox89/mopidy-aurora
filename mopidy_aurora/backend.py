from __future__ import absolute_import, unicode_literals

import tornado.web
import tornado.wsgi
import os

from mopidy import ext
from .nanoleaf import Aurora
from .tplink_smartplug import TPLinkSmartPlug

aurora = None
tp = None

gauroraip = ""
gtpip = ""
glogger = ""

def setlogger(logger):
    global glogger
    glogger = logger

def getaurorainstance():
    global aurora
    global tp
    if not aurora:
        aurora = Aurora(gauroraip, "1tHOYr0jYUm2dIlELluQXGAJV97Svqcw")
    
    return aurora

def gettpinstance():
    global tp
    if not tp:
        tp = TPLinkSmartPlug(gtpip)

    return tp

class RebootHandler(tornado.web.RequestHandler):
    def put(self):
        command = "/usr/bin/sudo /sbin/reboot"
        import subprocess
        process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
        output = process.communicate()[0]

class TPOnOffHandler(tornado.web.RequestHandler):
    def get(self):
        data = tornado.escape.json_encode(gettpinstance().power)
        self.write(data)

    def put(self):
        data = tornado.escape.json_decode(self.request.body)
        gettpinstance().power = data["on"]

class AuroraOnOffHandler(tornado.web.RequestHandler):
    def get(self):
        data = tornado.escape.json_encode(getaurorainstance().on)
        self.write(data)

    def put(self):
        data = tornado.escape.json_decode(self.request.body)
        getaurorainstance().on = data["on"]

class AuroraEffectHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(getaurorainstance().effect)

    def put(self):
        getaurorainstance().effect = self.request.body

class AuroraBrightnessHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(getaurorainstance().brightness))

    def put(self):
        getaurorainstance().brightness = int(self.request.body)

class AuroraSaturationHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(getaurorainstance().saturation))

    def put(self):
        getaurorainstance().saturation = int(self.request.body)

class AuroraHueHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(getaurorainstance().hue))

    def put(self):
        getaurorainstance().hue = int(self.request.body)

class AuroraTemperatureHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(getaurorainstance().color_temperature))

    def put(self):
        getaurorainstance().color_temperature = int(self.request.body)

class AuroraEffectListHandler(tornado.web.RequestHandler):
    def get(self):
        data = tornado.escape.json_encode(getaurorainstance().effects_list)
        self.write(data)


def app_factory(config, core):
    global gauroraip
    global gtpip
    gauroraip = config["aurora"]["auroraip"]
    gtpip = config["aurora"]["tpip"]

    glogger.error(str(gauroraip))

    auroraPath = os.path.join(os.path.dirname(__file__), 'static')
    indexPath = os.path.join(os.path.dirname(__file__), 'static/index.html')
    with open(indexPath, 'r') as myfile:
        indexData=myfile.read().replace('\n', '')

    def wsgi_app(environ, start_response):
        status = '200 OK'
        response_headers = [('Content-type', 'text/html')]
        start_response(status, response_headers)
        return [
            indexData
        ]
    return [
        (r'/aurora/reboot', RebootHandler),
        (r'/aurora/power', TPOnOffHandler),
        (r'/aurora/on', AuroraOnOffHandler),
        (r'/aurora/effect', AuroraEffectHandler),
        (r'/aurora/effect_list', AuroraEffectListHandler),
        (r'/aurora/brightness', AuroraBrightnessHandler),
        (r'/aurora/saturation', AuroraSaturationHandler),
        (r'/aurora/hue', AuroraHueHandler),
        (r'/aurora/temperature', AuroraTemperatureHandler),
        (r'/browse/(.*)', tornado.web.FallbackHandler, { 'fallback': tornado.wsgi.WSGIContainer(wsgi_app), }),
        (r'/search/(.*)', tornado.web.FallbackHandler, { 'fallback': tornado.wsgi.WSGIContainer(wsgi_app), }),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': auroraPath, "default_filename": "index.html"}),
    ]

