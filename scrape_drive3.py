import urllib.request
import re

url = "https://drive.google.com/drive/folders/1pHdcqjr5-CHNY24YqAF9vYhxX2ChHRE2?usp=sharing"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # The item structure in Google Drive JS usually looks like: [ "1abcd...", "filename.png", ... ]
    matches = re.findall(r'\["(1[a-zA-Z0-9_-]{27,32})","([^"]+)"', html)
    print("Found files:")
    for id, name in matches:
        print(f"{id}: {name}")
except Exception as e:
    print(e)
