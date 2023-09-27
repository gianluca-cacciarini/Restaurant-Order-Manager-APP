from flask import Flask, request
from flask_restful import Api, Resource, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import requests
import json
from flask_cors import CORS
from datetime import date


app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///order_database.db'
db = SQLAlchemy(app)

url_kitchen = "http://kitchen:8001/kitchen"


class OrderModel(db.Model):
    restaurant_id = db.Column(db.String, primary_key=True)
    order_id = db.Column(db.Integer, primary_key=True)
    items_list = db.Column(db.JSON, nullable=False)
    order_status = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    token = db.Column(db.String, primary_key=True)
    table_id = db.Column(db.String, nullable=False)


with app.app_context():
    #db.drop_all()
    db.create_all()


items_fields = {
    'name': fields.String,
    'quantity': fields.Integer,
    'cost': fields.String,
    'category': fields.String
}

orders_field = {
    'restaurant_id': fields.String,
    'order_id': fields.Integer,
    'date': fields.String,
    'order_status': fields.String,
    'token': fields.String,
    'items_list': fields.List(fields.Nested(items_fields)),
    'table_id': fields.String
}


class Orders(Resource):
    @marshal_with(orders_field)
    def get(self):
        # TODO: check the token validity
        # TODO: understand if the token is a STAFF or a CLIENT
        print("len: ", len(request.args.keys()))
        if (len(request.args.keys()) != 0):
            for key in request.args.keys():
                print("key: ", key, " - value: ", request.args[key])
                args = json.loads(key)
                args['order_id'] = None
                continue
        else:
            args = request.get_json()

        print(args)

        if (args['order_id'] != None):
            query = OrderModel.query.filter_by(
                restaurant_id=args['restaurant_id'], order_id=args['order_id'], token=args['token']).all()
            return query, 200

        elif (args['order_id'] == None) and (args['token'] != None):
            query = OrderModel.query.filter_by().all()
            query = OrderModel.query.filter_by(
                restaurant_id=args['restaurant_id'], token=args['token']).all()
            print(query)
            return query, 200

        query = OrderModel.query.filter_by().all()
        query = OrderModel.query.filter_by(
            restaurant_id=args['restaurant_id']).all()
        return query, 200

    @marshal_with(orders_field)
    def post(self):

        # TODO: check the token validity
        # TODO: understand if the token is a STAFF or a CLIENT

        args = request.get_json()
        print("args: ", args)

        print("search")
        # find max id used until now
        exist = OrderModel.query.filter_by(
            restaurant_id=args['restaurant_id'], token=args['token']).first()
        # if there are no orders
        if not exist:
            max_id = 0
            # if there are orders
        else:
            # max_id = db.session.query(func.max(OrderModel.order_id)).filter_by(restaurant_id=args['restaurant_id'],token=args['token']).scalar()
            max_id = db.session.query(func.max(OrderModel.order_id)).scalar()
        max_id += 1

        print("done search")
        today = date.today()

        print("adding")
        new_order = OrderModel(restaurant_id=args['restaurant_id'], order_id=max_id, items_list=args['items_list'],
                               order_status="waiting", date=args['date'], token=args['token'], table_id=args['table_id'])
        db.session.add(new_order)
        db.session.commit()
        print("added")

        response2Webpage = {'restaurant_id': args['restaurant_id'],
                            'items_list': args['items_list'],
                            'order_status': 'waiting',
                            'date': args['date'],
                            'order_id': max_id,
                            'token': args['token'],
                            'kitchen_status_function': 'waiting',
                            'table_id': args['table_id']}
        print("sending: ", response2Webpage)
        requests.put(url_kitchen, json=response2Webpage)
        print("sent")
        return response2Webpage, 200

    @marshal_with(orders_field)
    def patch(self):

        # TODO: check the token validity
        # TODO: understand if the token is a STAFF or a CLIENT

        args = request.get_json()
        result = OrderModel.query.get(
            (args['restaurant_id'], args['order_id'], args['token']))
        if not result:
            abort(404, message="Can't update, order not found...")

        # modify order
        if (args['order_status'] != None):
            result.order_status = args['order_status']

        db.session.commit()
        return result, 200

    @marshal_with(orders_field)
    def delete(self):

        # TODO: check the token validity
        # TODO: understand if the token is a STAFF or a CLIENT
        Client = True

        # check if order exists
        args = request.get_json()

        if (Client):
            result = OrderModel.query.get(
                (args['restaurant_id'], args['order_id'], args['token']))
            if not result:
                abort(404, message="Can't delete, order not found...")

            # delete order
            order = OrderModel.query.get(
                (args['restaurant_id'], args['order_id'], args['token']))
            db.session.delete(order)
            db.session.commit()
            return result, 200

        return 200


api.add_resource(Orders, "/orders")

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=8000)
