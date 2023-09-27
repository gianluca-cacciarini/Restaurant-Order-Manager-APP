from flask import Flask, request
from flask_restful import Api, Resource
from sqlalchemy import null
import requests
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

url_orders = "http://orders:8000/orders"


class Chart(Resource):
    def get(self):
        args = request.get_json()
        print("args: ", args)
        restaurant_id = args['restaurant_id']
        all_orders = get_orders(null, restaurant_id)
        print("all orders: ", all_orders)
        return all_orders, 200


def get_orders(order, restaurant_id):
    if (order != null):
        token = order['token']
    else:
        token = None
    order_id = None
    date = None
    response = requests.get(url_orders, json={
                            'restaurant_id': restaurant_id, 'token': token, 'order_id': order_id, 'date': date})
    print("GET_orders: ", response.json())
    return response.json()


api.add_resource(Chart, "/chart")

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=8007)
