import urllib.request
import re

url = "https://drive.google.com/drive/folders/1pHdcqjr5-CHNY24YqAF9vYhxX2ChHRE2?usp=sharing"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'\["([a-zA-Z0-9_-]{28,33})"\]', html)
    # also try looking for pattern: ["<id>","<name>"
    matches2 = re.findall(r'\["([a-zA-Z0-9_-]{28,33})","([^"]+)"', html)
    print("Matches 1:", len(set(matches)))
    for m in set(matches2):
        print(m[0], m[1])
except Exception as e:
    print(e)
