from flask import Flask, render_template
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__, template_folder='../templates',
            static_folder='../static')
CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurants_database.db'
db = SQLAlchemy(app)

url_orders = "http://orders:8000/orders"
url_get_restaurants = "http://auth:8003/restaurants"

# lf TODO: add foreign keys constraints and not null


# lf ===============================
# lf ========== FRONT END ==========
# lf ===============================

@app.route("/staff/<restaurant_id>/", methods=['GET', 'POST'])
def index(restaurant_id):
    return render_template('/staff_main.html', restaurant_id=restaurant_id)


# lf ==============================
# lf ========== BACK END ==========
# lf ==============================


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=8006)
