import urllib.request

ids = [
"132HIqxOov5auLlab8dpe3mfbEv-ucUrR",
"1hp0NV0r48IdvUdXpO4qNepric6MzXK2a",
"1KhfoMMmKBYsC0Yleq3D_7gnvQecK6XLS",
"1ME7kSn66aGLdTylUAMQXC89YmC2DPNWu",
"1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXf",
"1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6c",
"1OpG-luSajdW_lODfTcnm1gxynjCDB2kH",
]

for i in ids:
    try:
        url = f"https://drive.google.com/uc?export=view&id={i}"
        req = urllib.request.Request(url, method='HEAD')
        res = urllib.request.urlopen(req)
        print(i, res.headers.get('Content-Type'))
    except Exception as e:
        print(i, e)
