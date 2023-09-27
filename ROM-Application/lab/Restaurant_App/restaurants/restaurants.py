from flask import Flask, render_template
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
import requests
from flask_cors import CORS


app = Flask(__name__, template_folder='../templates',
            static_folder='../static')
CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurants_database.db'
db = SQLAlchemy(app)

url_get_restaurants = "http://auth:8003/restaurants"

# lf TODO: add foreign keys constraints and not null


class Restaurant(db.Model):
    restaurant_id = db.Column(db.String, primary_key=True)


with app.app_context():
    #db.drop_all()
    db.session.commit()


restaurantParser = reqparse.RequestParser()
restaurantParser.add_argument("restaurant_id", type=str)


# lf ===============================
# lf ========== FRONT END ==========
# lf ===============================

@app.route("/", methods=['GET', 'POST'])
def index():
    response = requests.get(url_get_restaurants, json={"restaurants": "si"})
    if (response.ok):
        restaurants = response.json()
        print(restaurants)
    return render_template('/restaurants.html', restaurants=restaurants)


# lf ==============================
# lf ========== BACK END ==========
# lf ==============================

class Restaurants(Resource):

    # lf marshaling filters returned object's fields
    def get(self):
        return 200


api.add_resource(Restaurants, "/restaurants")


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=8005)
