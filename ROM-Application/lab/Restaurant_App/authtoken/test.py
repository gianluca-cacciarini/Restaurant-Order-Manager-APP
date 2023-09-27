import requests
import json

#ESISTENZA RISTORANTE
s = requests.get("http://127.0.0.1:8003/restaurant", json={"restaurant": "Paolo restaurant"})
#s2 = requests.get("http://127.0.0.1:8003/token", json={"token": "PAOLO1", "restaurant": "Paolo restaurant"})
#LISTA DEI RISTORANTI
s3 = requests.get("http://127.0.0.1:8003/restaurants", json={"restaurants": "1"})
#VALIDITà TOKEN PER UNO SPECIFICO RISTORANTE
s4 = requests.get("http://127.0.0.1:8003/validity", json={"token": "PAOLO1", "restaurant": "Paolo"})
s5 = requests.put("http://127.0.0.1:8003/token", json={"token": "PAOLO4", "restaurant": "Paolo"})
s6 = requests.get("http://127.0.0.1:8003/validity", json={"token": "PAOLO1", "restaurant": "Paolo restaurant"})

s7 = requests.get("http://127.0.0.1:8003/user_verification", json={"restaurant": "Da Ciccio"})

print(s.text)
#print(s2.text)
print(s3.text)
print(s4.text)
print(s6.text)
print(s7.text)

# js = json.loads(s3.text)
# for elem in js:
#     print(elem)
#     print(elem["restaurant_name"])





