import requests


f = {"user":"hanzala","password": "qsa-1299","value":"hanzala"}
r = requests.post("http://localhost:3000/api/qwerty",headers = f)
print(r.status_code)
print(r.text)