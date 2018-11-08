from __future__ import absolute_import, unicode_literals

import tornado.web
import tornado.wsgi
import os

from mopidy import ext
from .nanoleaf import Aurora
from .tplink_smartplug import TPLinkSmartPlug

aurora = Aurora("192.168.2.101", "1tHOYr0jYUm2dIlELluQXGAJV97Svqcw")
tplink = TPLinkSmartPlug('192.168.2.100')
glogger = ""
def setlogger(logger):
    global glogger
    glogger = logger

class RebootHandler(tornado.web.RequestHandler):
    def put(self):
        command = "/usr/bin/sudo /sbin/reboot"
        import subprocess
        process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
        output = process.communicate()[0]

class TPOnOffHandler(tornado.web.RequestHandler):
    def get(self):
        data = tornado.escape.json_encode(tplink.power)
        self.write(data)

    def put(self):
        data = tornado.escape.json_decode(self.request.body)
        tplink.power = data["on"]

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

class AuroraSaturationHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(aurora.saturation))

    def put(self):
        aurora.saturation = int(self.request.body)

class AuroraHueHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(aurora.hue))

    def put(self):
        aurora.hue = int(self.request.body)

class AuroraTemperatureHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(str(aurora.color_temperature))

    def put(self):
        aurora.color_temperature = int(self.request.body)

class AuroraEffectListHandler(tornado.web.RequestHandler):
    def get(self):
        data = tornado.escape.json_encode(aurora.effects_list)
        self.write(data)


def app_factory(config, core):
    database = "wtf"
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

