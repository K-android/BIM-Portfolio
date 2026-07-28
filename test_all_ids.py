import urllib.request
import re

with open("drive_folder.html", "r") as f:
    html = f.read()

ids = set(re.findall(r'1[a-zA-Z0-9_-]{32}', html))

valid_ids = []
for i in ids:
    try:
        url = f"https://drive.google.com/uc?export=view&id={i}"
        req = urllib.request.Request(url, method='HEAD')
        res = urllib.request.urlopen(req)
        ct = res.headers.get('Content-Type')
        if ct and ct.startswith('image'):
            valid_ids.append(i)
            print(f"Valid image: {i} ({ct})")
    except Exception as e:
        pass

print("ALL VALID:")
for i in valid_ids:
    print(f'"https://lh3.googleusercontent.com/d/{i}",')
