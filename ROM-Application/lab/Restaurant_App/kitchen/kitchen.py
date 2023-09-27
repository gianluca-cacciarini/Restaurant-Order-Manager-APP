from flask import Flask, render_template, request
from flask_restful import Api, Resource, marshal_with, reqparse, fields
from flask_sqlalchemy import SQLAlchemy
import requests
from flask_cors import CORS


app = Flask(__name__, template_folder='../templates',
            static_folder='../static')
CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///kitchen_database.db'
db = SQLAlchemy(app)

url_orders = "http://orders:8000/orders"

# lf TODO: add foreign keys constraints and not null


class Order(db.Model):
    restaurant_id = db.Column(db.String, primary_key=False)
    table_id = db.Column(db.Integer)
    order_id = db.Column(db.Integer, primary_key=True)
    order_status = db.Column(db.String(100), nullable=False)
    token = db.Column(db.String, primary_key=False)
    date = db.Column(db.String(10), nullable=False)
    items_list = db.Column(db.JSON, nullable=False)


# class Item(db.Model):
#     item_name = db.Column(db.String, primary_key=True)
#     item_description = db.Column(db.String, primary_key=False)
#     category = db.Column(db.String, nullable=False)
#     price = db.Column(db.Integer, primary_key=False)
#     allergens = db.Column(db.String(10), nullable=False)
#     # picture            = db.Column(db.LargeBinary, nullable=False)



#drop all remove all tables
with app.app_context():
    db.drop_all()
    db.create_all()

    

# # lf filters when marshaling
# items_fields = {
#     'item_name': fields.String,
#     'item_description': fields.String,
#     'category': fields.String,
#     'price': fields.Integer,
#     'allergens': fields.String
#     # lf TODO: add image datatype
# }

items_fields = {
    'name': fields.String,
    'quantity': fields.Integer,
    'cost': fields.String,
    'category': fields.String
}

orders_fields = {
    'restaurant_id': fields.String,
    'table_id': fields.Integer,
    'order_id': fields.Integer,
    'order_status': fields.String,
    'token': fields.String,
    'date': fields.String,
    'items_list': fields.List(fields.Nested(items_fields))
}


# lf parser from JSON to Model instance
orderParser = reqparse.RequestParser()
orderParser.add_argument("restaurant_id", type=str)
orderParser.add_argument("table_id", type=int)
orderParser.add_argument("order_id", type=int)
orderParser.add_argument("order_status", type=str)
orderParser.add_argument("token", type=str)
orderParser.add_argument("date", type=str)
orderParser.add_argument("items_list", type=list)


# lf ===============================
# lf ========== FRONT END ==========
# lf ===============================
@app.route("/staff/<restaurant_id>/kitchen", methods=['GET', 'POST'])
def get(restaurant_id):
    orders = Order.query.filter_by(restaurant_id=restaurant_id).all()
    print(orders)
    return render_template('/kitchen.html', restaurant_id=restaurant_id, orders=orders)


# lf ==============================
# lf ========== BACK END ==========
# lf ==============================

@app.route('/move_order', methods=['POST'])
def move_order():
    print("Moving...")
    restaurant_id = request.json['restaurant_id']
    order_id = request.json['order_id']
    order_status = request.json['order_status']
    # Call the function in your kitchen.py file with the restaurant_id and order_id
    # Perform necessary logic and processing
    orderToModify = Order.query.filter_by(
        restaurant_id=restaurant_id, order_id=order_id).first()
    match order_status:
        case 'waiting':
            orderToModify.order_status = "in_progress"
        case 'in_progress':
            orderToModify.order_status = "ready"
        case other:
            print('No match found for order status.')
    db.session.commit()

    response2Webpage = {'restaurant_id': orderToModify.restaurant_id,
                        'order_status': orderToModify.order_status,
                        'date': orderToModify.date,
                        'order_id': orderToModify.order_id,
                        'table_id': orderToModify.table_id,
                        'token': orderToModify.token,
                        'items_list': orderToModify.items_list
                        }

    # lf notify orders container of update
    requests.patch(url_orders, json=response2Webpage)
    print("Moved.")
    print("Done!")
    return response2Webpage


class Kitchen(Resource):

    @marshal_with(orders_fields)
    # lf marshaling filters returned object's fields
    def put(self):
        print("Parsing...")
        #args = orderParser.parse_args()
        args = request.get_json()
        print("######### ARGS #########")
        print(args)
        print("Parsed.")
        #newOrder = Order(**args)
        newOrder = Order(restaurant_id=args['restaurant_id'], order_id=args['order_id'], items_list=args['items_list'],
                               order_status=args['order_status'], date=args['date'], token=args['token'], table_id=args['table_id'])
    


        print("######### NEW ORDER #########")
        print(newOrder)
        print("Adding...")
        db.session.add(newOrder)
        db.session.commit()
        print("Added.")

        print("Done!")
        print("Redirecting...")
        orders = Order.query.all()
        print("######### ORDERS #########")
        print(orders)
        return render_template('/kitchen.html', orders=orders)


api.add_resource(Kitchen, "/kitchen")

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=8001)
