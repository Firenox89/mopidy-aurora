#!/usr/bin/env python2
#
# TP-Link Wi-Fi Smart Plug Protocol Client
# For use with TP-Link HS-100 or HS-110
#
# by Lubomir Stroetmann
# Copyright 2016 softScheck GmbH
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import socket
import tornado.web
from struct import pack

version = 0.2

# Predefined Smart Plug Commands
# For a full list of commands, consult tplink_commands.txt
commands = {'info'     : '{"system":{"get_sysinfo":{}}}',
'on'       : '{"system":{"set_relay_state":{"state":1}}}',
'off'      : '{"system":{"set_relay_state":{"state":0}}}',
'cloudinfo': '{"cnCloud":{"get_info":{}}}',
'wlanscan' : '{"netif":{"get_scaninfo":{"refresh":0}}}',
'time'     : '{"time":{"get_time":{}}}',
'schedule' : '{"schedule":{"get_rules":{}}}',
'countdown': '{"count_down":{"get_rules":{}}}',
'antitheft': '{"anti_theft":{"get_rules":{}}}',
'reboot'   : '{"system":{"reboot":{"delay":1}}}',
'reset'    : '{"system":{"reset":{"delay":1}}}',
'energy'   : '{"emeter":{"get_realtime":{}}}'
}

class TPLinkSmartPlug(object):
    def __init__(self, ip_address):
        # Set target IP, port and command to send
        self.ip = ip_address
        self.port = 9999

    # Encryption and Decryption of TP-Link Smart Home Protocol
    # XOR Autokey Cipher with starting key = 171
    def __encrypt(self, string):
        key = 171
        result = pack('>I', len(string))
        for i in string:
            a = key ^ ord(i)
            key = a
            result += chr(a)
        return result

    def __decrypt(self, string):
        key = 171
        result = ""
        for i in string:
            a = key ^ ord(i)
            key = ord(i)
            result += chr(a)
        return result

    def __send(self, cmd):
        # Send command and receive reply
        try:
            sock_tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock_tcp.connect((self.ip, self.port))
            sock_tcp.send(self.__encrypt(cmd))
            data = sock_tcp.recv(2048)
            sock_tcp.close()

            response = self.__decrypt(data[4:])
            # print "Sent:     ", cmd
            # print "Received: ", response
            return response
        except socket.error:
            quit("Cound not connect to host " + self.ip + ":" + str(self.port))

    @property
    def info(self):
        return self.__send(commands['info'])

    @property
    def power(self):
        response = self.__send(commands['info'])
        data = tornado.escape.json_decode(response)
        state = data["system"]["get_sysinfo"]["relay_state"]
        return state == 1

    @power.setter
    def power(self, on):
        if on:
            self.__send(commands['on'])
        else:
            self.__send(commands['off'])

