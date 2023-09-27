from flask import Flask, render_template, url_for, redirect, request, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_bcrypt import Bcrypt
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_cors import CORS, cross_origin
import json
import random


app = Flask(__name__, template_folder='../templates',
            static_folder='../static')
api = Api(app)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'thisisasecretkey'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    return Restaurant.query.get(int(user_id))


class Restaurant(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_name = db.Column(db.String(20), unique=True)
    password = db.Column(db.String(80), nullable=False)


token_query = {
    'restaurant': fields.String,
    'result': fields.String,
    'token': fields.String,
    'table_id': fields.String
}


token = {
    "id": fields.Integer,
    "status": fields.Boolean,
    "table_id": fields.Integer,
    "restaurant_name": fields.String,
    "seats": fields.Integer,
    "token_string": fields.String


}

restaurants = {
    "restaurant_name": fields.String
}


class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Boolean, nullable=False)
    # status 0 = token not active, status 1 = token active
    table_id = db.Column(db.Integer, nullable=False)
    restaurant_name = db.Column(db.String(20), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    token_string = db.Column(db.String(20), nullable=False)


class RegisterForm(FlaskForm):
    restaurant_name = StringField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={"placeholder": "Restaurant name"})

    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField("Register")

    def validate_restaurant_name(self, restaurant_name):
        existing_restaurant_name = Restaurant.query.filter_by(
            restaurant_name=restaurant_name.data).first()
        if existing_restaurant_name:
            raise ValidationError(
                "That restaurant name already exists. Please choose a different one.")


class LoginForm(FlaskForm):
    restaurant_name = StringField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={"placeholder": "Restaurant name"})

    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField("Login")


with app.app_context():
    #db.drop_all()
    db.create_all()


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/staff/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        restaurant = Restaurant.query.filter_by(
            restaurant_name=form.restaurant_name.data).first()
        if restaurant:
            if bcrypt.check_password_hash(restaurant.password, form.password.data):
                login_user(restaurant)
                # Salva l'ID utente nella sessione
                username = form.restaurant_name.data
                session['user_id'] = str(restaurant.id)
                return redirect("http://staff_main:8006/staff/" + username)
            else:
                flash('Error. Incorrect Password', 'error')
        flash('Error. Incorrect Username', 'error')
    return render_template('login.html', form=form)


@app.before_request
def before_request():
    # Recupera l'ID utente dalla sessione e carica l'utente corrispondente da database
    user_id = session.get('user_id')
    if user_id:
        user = Restaurant.query.get(user_id)
        if user:
            login_user(user)


@app.route('/staff/<restaurant>/token', methods=['GET', 'POST'])
@login_required
def dashboard(restaurant):
    if current_user.is_active and restaurant == current_user.restaurant_name:
        # proceed
        user = current_user.restaurant_name
        query = Token.query.filter_by(restaurant_name=user).all()
        return render_template('dashboard.html', query=query, restaurant_id=user)
    else:
        return "Access Denied"


@app.route('/insert', methods=['POST'])
def insert():
    if request.method == 'POST':
        form_table_id = request.form['formTableNumber']
        form_seats_num = request.form['formNumberOfSeats']
        form_token_string = request.form['formTokenString']
        res = Token.query.filter_by(
            token_string=form_token_string, restaurant_name=current_user.restaurant_name).first()
        res1 = Token.query.filter_by(
            table_id=form_table_id, restaurant_name=current_user.restaurant_name).first()
        if res:
            flash('That Token String already exists! Choose a different one.', 'error')
        if res1:
            flash('That Table Number already exists! Choose a different one.', 'error')
        if not res and not res1:
            new_token = Token(status=1, table_id=form_table_id, restaurant_name=current_user.restaurant_name,
                              seats=form_seats_num, token_string=form_token_string)
            db.session.add(new_token)
            db.session.commit()
            flash('New Table Added.', 'success')

        return redirect(url_for('dashboard', restaurant=current_user.restaurant_name))

# Function that changes the status of the token


@app.route('/status', methods=['POST'])
def status():
    res = Token.query.filter_by(
        token_string=request.form['status'], restaurant_name=current_user.restaurant_name).first()
    res.status = False
    db.session.commit()
    return redirect(url_for('dashboard', restaurant=current_user.restaurant_name))


@app.route('/delete', methods=['POST'])
def delete():
    res = Token.query.filter_by(
        token_string=request.form['token'], restaurant_name=current_user.restaurant_name).first()
    db.session.delete(res)
    db.session.commit()
    return redirect(url_for('dashboard', restaurant=current_user.restaurant_name))


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    session.pop('user_id', None)
    return redirect(url_for('login'))


@app.route('/staff/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)
        new_user = Restaurant(
            restaurant_name=form.restaurant_name.data, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))

    return render_template('register.html', form=form)


class Restaurant_existence(Resource):
    def get(self):
        for item in request.get_json():
            print("key: ", item, " value: ", request.get_json()[item])
        if "restaurant" in request.get_json():
            print("mi sta chiedendo se esiste il reststaurant: ",
                  request.get_json()["restaurant"])
            res = Restaurant.query.filter_by(
                restaurant_name=request.get_json()["restaurant"]).first()
            if res:
                return {"result": "yes"}
            else:
                return {"result": "no"}
        else:
            return {"error": "error"}


class Restaurants(Resource):
    @marshal_with(restaurants)
    def get(self):
        if "restaurants" in request.get_json():
            res = Restaurant.query.all()
            return res


class Token_existence(Resource):
    def get(self):
        # print("len: ",len(request.args.keys()))
        if (len(request.args.keys()) != 0):
            for key in request.args.keys():
                # print("key: ",key," - value: ",request.args[key])
                args = json.loads(key)
                args['order_id'] = None
                continue
        else:
            args = request.get_json()

        res = Token.query.filter_by(
            token_string=args["token"], restaurant_name=args["restaurant"]).first()
        if res.status == True:
            return {"result": "yes"}
        else:
            return {"result": "no"}


class Token_status(Resource):
    def get(self):

        # print("len: ",len(request.args.keys()))
        if (len(request.args.keys()) != 0):
            for key in request.args.keys():
                # print("key: ",key," - value: ",request.args[key])
                args = json.loads(key)
                args['order_id'] = None
                continue
        else:
            args = request.get_json()
        res = Token.query.filter_by(
            token_string=args["token"], restaurant_name=args["restaurant"]).first()
        res.status = True
        s1 = res.token_string
        "tavolo13"
        if "_" not in s1:
            res.token_string = res.token_string + "_1"
        else:
            ll = res.token_string.split("_")
            print(ll)
            x = int(ll[1])
            res.token_string = ll[0] + "_" + str(x+1)
            print(res.token_string)
        db.session.commit()


class Token_validity(Resource):
    # @marshal_with(token_query)
    def get(self):

        # print("len: ",len(request.args.keys()))
        if (len(request.args.keys()) != 0):
            for key in request.args.keys():
                # print("key: ",key," - value: ",request.args[key])
                args = json.loads(key)
                args['order_id'] = None
                continue
        else:
            args = request.get_json()

        print("args:", args)

        res = Token.query.filter_by(
            token_string=args["token"], restaurant_name=args["restaurant"]).first()
        print("res: ", res)

        if res:
            if res.status == 0:
                print("case 1")
                return {'result': 'yes', 'table_id': str(res.table_id)}
            else:
                print("case 2")
                return {"result": 'no', 'table_id': str(res.table_id)}
        else:
            print("case 3")
            return {"result": "error"}


api.add_resource(Restaurant_existence, "/restaurant")
api.add_resource(Restaurants, "/restaurants")
api.add_resource(Token_existence, "/token")
api.add_resource(Token_status, "/token_status")
api.add_resource(Token_validity, "/validity")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8003)
