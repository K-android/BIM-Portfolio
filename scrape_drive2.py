import urllib.request
import re

url = "https://drive.google.com/drive/folders/1pHdcqjr5-CHNY24YqAF9vYhxX2ChHRE2?usp=sharing"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # find all strings that look like a drive file ID (28-33 chars, usually starting with 1)
    # in the js data
    matches = re.findall(r'\["(1[a-zA-Z0-9_-]{27,32})",', html)
    for m in set(matches):
        print(m)
except Exception as e:
    print(e)
