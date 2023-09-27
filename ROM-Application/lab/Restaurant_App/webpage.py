from flask import Flask, render_template, request, jsonify
import json
import requests
from flask_cors import CORS
from sqlalchemy import null

app = Flask(__name__, template_folder='./templates')
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

url_orders = "http://orders:8000/orders"
url_staff_menu = "http://staff_menu:8004/staff_menu"
url_authentication_rest_exist = "http://auth:8003/restaurant"

@app.route("/staff/<restaurant_id>/chart/", methods=['GET', 'POST'])
def chart(restaurant_id):
    res = requests.get(url_authentication_rest_exist,
                       json={"restaurant": restaurant_id})
    res = res.json()
    print(res, res['result'])

    if (res['result'] == "no"):
        print("error, the restaurant doesn't exist")
        return render_template('error_page.html')

    response = get_orders(null, restaurant_id)
    print("chart response", response)
    return render_template('chart.html', ret=response, restaurant_id=restaurant_id)


# the URL takes in input the name of the restaurant so in this way we can distinguish the web page of each restaurant
@app.route("/<restaurant_id>", methods=['GET', 'POST'])
def user(restaurant_id):
    print("restaurant_id: ", restaurant_id)

    res = requests.get(url_authentication_rest_exist,
                       json={"restaurant": restaurant_id})
    res = res.json()
    print(res, res['result'])

    if (res['result'] == "no"):
        print("error, the restaurant doesn't exist")
        return render_template('error_page.html')

    # print("request form: ",request.form)

    for item in request.form:
        order = json.loads(item)

    # lf retrieving restaurant's menu
    response = requests.get(url_staff_menu, json={
                            'restaurant_id': restaurant_id})

    restaurant_menu = response.json()


    if (len(request.form) == 0):
        return render_template('menu.html', rest_id=restaurant_id, menu=restaurant_menu)
    print("order: ", order)

    # case where we want to get order list
    # if("get_order" in request.form):
    if (order["type"] == "get_order"):
        print("GET")
        response = get_orders(order, restaurant_id)
        return jsonify(previous_orders_list=response)
        # return render_template('menu.html',previous_orders_list=response, rest_id=restaurant_id, menu=json.loads(test),token=order['token'])

    # if("post_order" in request.form):
    if (order["type"] == "post_order"):
        print("POST")
        post_orders(order, restaurant_id)
        # response = get_orders(order,restaurant_id)
        # return render_template('menu.html',previous_orders_list=response,  rest_id=restaurant_id, menu=json.loads(test),token=order['token'])
        return render_template('menu.html',  rest_id=restaurant_id, menu=restaurant_menu, token=order['token'])

    # if("delete_order" in request.form):
    if (order["type"] == "delete_order"):
        print("DELETE")
        response = delete_orders(order, restaurant_id)
        return render_template('menu.html', ret_delete=response, rest_id=restaurant_id, menu=restaurant_menu, token=order['token'])

    return render_template('menu.html', rest_id=restaurant_id, menu=restaurant_menu)


def get_orders(order, restaurant_id):
    if (order != null):
        token = order['token']
    else:
        token = None
    order_id = None
    date = None
    response = requests.get(url_orders, json={
                            'restaurant_id': restaurant_id, 'token': token, 'order_id': order_id, 'date': date})
    print("GET_orders: ", response.text)
    return response.json()


def post_orders(order, restaurant_id):
    response = requests.post(url_orders, json=order)
    print("POST_orders: ", response.text)
    return response.json()


def delete_orders(order, restaurant_id):
    token = order['token']
    order_id = order['order_id']
    response = requests.delete(url_orders, json={
                               'restaurant_id': restaurant_id, 'order_id': order_id, 'token': token})
    print(response.json())
    return response.json()


if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0", port=8002)
