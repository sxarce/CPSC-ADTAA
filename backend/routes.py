import logging
from flask import current_app, jsonify, request
from flask_cors import cross_origin
from app import create_app, db
# from models import Articles,articles_schema
from models import User, users_schema, user_schema
from flask_login import login_user

import sys

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import unset_jwt_cookies, get_jwt

import json
from datetime import timedelta, timezone, datetime
# from flask_jwt_extended import JWTManager

from flask_jwt_extended import JWTManager

# Create an application instance
app = create_app()

# Define a route to fetch the avaialable articles
# @app.route("/")
# @app.route("/articles", methods=["GET"], strict_slashes=False)
# def articles():
# 	articles = Articles.query.all()
# 	results = articles_schema.dump(articles)
# 	return jsonify(results)


@app.route("/")
@app.route("/hello-world")
def hello():
    print("hello world", file=sys.stderr)  # for debugging
    return "<h1>hello world</h1>"


@app.route("/register-user", methods=["POST"], strict_slashes=False)
@cross_origin()
def register_user():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    accessLevel = request.json['accessLevel']
    new_user = User(username=username, email=email,
                    password=password, accessLevel=accessLevel)

    db.session.add(new_user)
    db.session.commit()

    # DELETE ALL ENTRIES FROM DB (On submit form)
    # db.session.query(User).delete()
    # db.session.commit()

    return user_schema.jsonify(new_user)

# LOGIN ROUTES


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


@app.route("/login-user", methods=['GET', 'POST'])
@cross_origin()
def login_user():  # create_token()
    usernameInput = request.json['username']
    passwordInput = request.json['password']
    attempted_user = User.query.filter_by(username=usernameInput).first()
    if not attempted_user:
        attempted_user = User.query.filter_by(email=usernameInput).first()

    print(attempted_user, file=sys.stderr)

    if not attempted_user or attempted_user.password != passwordInput:
        return {"msg": "wrong email or password"}, 401

    access_token = create_access_token(identity=usernameInput)
    
    return jsonify(access_token=access_token, email=attempted_user.email, accessLevel=attempted_user.accessLevel)


# TODO: NOT USED
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()

    # returns {logged_in_as: "<value>", access_token: "<value>"}
    return jsonify(logged_in_as=current_user), 200


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


# gives email and accesslevel to render on UI
@app.route("/credentials", methods=['GET'])
@jwt_required()
def credentials():
    username = get_jwt_identity()
    current_user = User.query.filter_by(username=username).first()

    if not current_user:
        current_user = User.query.filter_by(email=username).first()

    credentials = {"email": current_user.email,
                   "accessLevel": current_user.accessLevel}
    print(credentials, file=sys.stderr)

    return credentials


# refreshing jwt tokens
jwt = JWTManager(app)

# TODO: test to see if this works?


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(hours=1))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


if __name__ == "__main__":

    app.run(debug=True)
