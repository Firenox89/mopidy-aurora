import requests

class Aurora(object):
    def __init__(self, ip_address, auth_token):
        self.baseUrl = "http://" + ip_address + ":16021/api/v1/" + auth_token + "/"
        self.ip_address = ip_address
        self.auth_token = auth_token

    def __repr__(self):
        return "<Aurora(" + self.ip_address + ")>"

    def __put(self, endpoint, data):
        url = self.baseUrl + endpoint
        try:
            r = requests.put(url, json=data)
        except requests.exceptions.RequestException as e:
            print(e)
            return
        return self.__check_for_errors(r)

    def __get(self, endpoint):
        url = self.baseUrl + endpoint
        try:
            r = requests.get(url)
        except requests.exceptions.RequestException as e:
            print(e)
            return
        return self.__check_for_errors(r)

    def __delete(self, endpoint):
        url = self.baseUrl + endpoint
        try:
            r = requests.delete(url)
        except requests.exceptions.RequestException as e:
            print(e)
            return
        return self.__check_for_errors(r)

    def __check_for_errors(self, r):
        if r.status_code == 200:
            if r.text == "":  # BUG: Delete User returns 200, not 204 like it should, as of firmware 1.5.0
                return None
            return r.json()
        elif r.status_code == 204:
            return None
        elif r.status_code == 403:
            print("Error 400: Bad request! (" + self.ip_address + ")")
        elif r.status_code == 401:
            print("Error 401: Not authorized! This is an invalid token for this Aurora (" + self.ip_address + ")")
        elif r.status_code == 404:
            print("Error 404: Resource not found! (" + self.ip_address + ")")
        elif r.status_code == 422:
            print("Error 422: Unprocessible Entity (" + self.ip_address + ")")
        elif r.status_code == 500:
            print("Error 500: Internal Server Error (" + self.ip_address + ")")
        else:
            print("ERROR! UNKNOWN ERROR " + str(r.status_code)
                  + ". Please post an issue on the GitHub page: https://github.com/software-2/nanoleaf/issues")
        return None


    @property
    def on(self):
        """Returns True if the device is on, False if it's off"""
        return self.__get("state/on/value")

    @on.setter
    def on(self, value):
        """Turns the device on/off. True = on, False = off"""
        data = {"on": value}
        self.__put("state", data)

    @property
    def off(self):
        """Returns True if the device is off, False if it's on"""
        return not self.on

    @off.setter
    def off(self, value):
        """Turns the device on/off. True = off, False = on"""
        self.on = not value

    def on_toggle(self):
        """Switches the on/off state of the device"""
        self.on = not self.on
