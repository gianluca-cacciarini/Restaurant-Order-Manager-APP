from flask import Flask, render_template, request
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__, template_folder='../templates',
            static_folder='../static')

CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///staff_menu_database.db'
db = SQLAlchemy(app)

# lf TODO: add foreign keys constraints and not null


class Item(db.Model):
    restaurant_id = db.Column(db.String, primary_key=True)
    item_name = db.Column(db.String, primary_key=True)
    item_description = db.Column(db.String(100), primary_key=False)
    category = db.Column(db.String)
    price = db.Column(db.Integer)
    allergens = db.Column(db.String)
    image_path = db.Column(db.String)  # New column for the image


with app.app_context():
    #db.drop_all()
    db.create_all()

    db.session.commit()


# lf filters when marshaling
items_fields = {
    'restaurant_id': fields.String,
    'name': fields.String(attribute='item_name'),
    'item_description': fields.String,
    'category': fields.String,
    'cost': fields.Integer(attribute='price'),
    'allergens': fields.String,
    'image_path': fields.String

}

# lf parser from JSON to Model instance
itemParser = reqparse.RequestParser()
itemParser.add_argument("restaurant_id", type=str)
itemParser.add_argument("item_name", type=str)
itemParser.add_argument("item_description", type=str)
itemParser.add_argument("category", type=str)
itemParser.add_argument("price", type=int)
itemParser.add_argument("allergens", type=str)
itemParser.add_argument("image_path", type=str)

restaurantParser = reqparse.RequestParser()
restaurantParser.add_argument("restaurant_id", type=str)


# lf ===============================
# lf ========== FRONT END ==========
# lf ===============================
@app.route("/staff/<restaurant_id>/menu", methods=['GET', 'POST'])
def get(restaurant_id):
    print("Retrieving items to display...")
    items = Item.query.filter_by(restaurant_id=restaurant_id).all()
    print("Done!")
    return render_template('/staff_menu.html', restaurant_id=restaurant_id, items=items)


# lf ==============================
# lf ========== BACK END ==========
# lf ==============================

# PUT and DELETE routes for updating and deleting items

@app.route("/<restaurant_id>/items/<item_name>", methods=['PUT', 'DELETE'])
def update_or_delete_item(restaurant_id, item_name):
    item = Item.query.filter_by(
        restaurant_id=restaurant_id, item_name=item_name).first()
    print(item)
    if item is None:
        return abort(404, message="Item not found")

    if request.method == 'PUT':

        item.item_name = request.form.get('edit-item-name', item.item_name)
        item.item_description = request.form.get(
            'edit-item-description', item.item_description)
        item.category = request.form.get('edit-item-category', item.category)
        item.price = request.form.get('edit-item-price', item.price)
        item.allergens = request.form.get(
            'edit-item-allergens', item.allergens)
        item.image_path = request.form.get('edit-item-image', item.image_path)

        db.session.commit()
        return {'message': 'Item updated successfully'}

    elif request.method == 'DELETE':
        # Delete item
        db.session.delete(item)
        db.session.commit()
        return {'message': 'Item deleted successfully'}


@app.route("/<restaurant_id>/items/add", methods=['PUT'])
def add_item(restaurant_id):

    print(len(request.form.get("item-image")))
    print(type(request.form.get("item-image")))

    if request.method == 'PUT':
        # Get the item details from the request
        item_name = request.form.get('item-name')
        item_price = request.form.get('item-price')
        item_allergens = request.form.get('item-allergens')
        item_category = request.form.get('item-category')
        item_description = request.form.get('item-description')
        item_img = request.form.get("item-image")

        # Create a new item object and save it to the database
        new_item = Item(
            restaurant_id=restaurant_id,
            item_name=item_name,
            item_description=item_description,
            category=item_category,
            price=item_price,
            allergens=item_allergens,
            image_path=item_img
        )
        db.session.add(new_item)
        db.session.commit()

        return {'message': 'Item added successfully'}


class StaffMenu(Resource):

    # lf marshaling filters returned object's fields
    @marshal_with(items_fields)
    def get(self):
        args = restaurantParser.parse_args()
        restaurant_id = args['restaurant_id']
        print("Retrieving items...")
        items = Item.query.filter_by(restaurant_id=restaurant_id).all()
        print("Retrieved items.")
        print(items)
        print("Returning items to requester...")
        return items


api.add_resource(StaffMenu, "/staff_menu")


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=8004)
