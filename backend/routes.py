from flask import current_app, flash, jsonify, request, redirect
from flask_cors import cross_origin
from app import create_app, db, mail
from models import User, users_schema, user_schema
from flask_login import login_user

import sys

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import unset_jwt_cookies, get_jwt

import json
from datetime import timedelta, timezone, datetime
from flask_jwt_extended import JWTManager

from flask_mail import Message
from flask import render_template, url_for
from itsdangerous import BadSignature, URLSafeTimedSerializer

# Create an application instance
app = create_app()

#######################################################
################## helper functions ###################
#######################################################


def send_confirmation_email(user_email):
    confirm_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

    confirm_url = url_for(
        'confirm_email',
        token=confirm_serializer.dumps(
            user_email, salt='email-confirmation-salt'),
        _external=True
    )

    msg = Message(subject='Confirm Your Email Address',
                  html=render_template(
                      'email_confirmation.html', confirm_url=confirm_url),
                  recipients=[user_email], sender=app.config['MAIL_USERNAME'])

    return mail.send(msg)

#############################################
################## routes ###################
#############################################


@app.route("/confirm/<token>")
def confirm_email(token):
    try:
        confirm_serializer = URLSafeTimedSerializer(
            current_app.config['SECRET_KEY'])
        email = confirm_serializer.loads(
            token, salt='email-confirmation-salt', max_age=3600)
    except BadSignature:
        # TODO: redirect template dead-end page
        print("The confirmation link is expired.", file=sys.stderr)

    existing_user = User.query.filter_by(email=email).first()

    if existing_user.email_confirmed:
        # TODO: Make template dead-end page to redirect to login (external url)
        print('Email already confirmed. Please log in', file=sys.stderr)
        return '<p>Email already confirmed. Please log in. </p>'
        # return redirect('http://localhost:3000/')
    else:
        existing_user.email_confirmed = True
        existing_user.email_confirmed_on = datetime.now()

        # supposedly UPDATES user
        db.session.add(existing_user)
        db.session.commit()
        # TODO: redirect to template dead-end page
        print('Thank you for confirming your email address.', file=sys.stderr)
        return '<p> Thank you for confirming your email address'

    # return jsonify(logged_in_as=existing_user.email), 200
    # return '<p> email confirmed </p>'


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

    send_confirmation_email(new_user.email)
    # For testing purposes: DELETE ALL ENTRIES FROM DB (On submit form)
    # db.session.query(User).delete()
    # db.session.commit()

    return user_schema.jsonify(new_user)


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
    elif not attempted_user.isValid:
        return {"msg": "Invalid account."}, 401

    access_token = create_access_token(identity=usernameInput)

    return jsonify(access_token=access_token, email=attempted_user.email, accessLevel=attempted_user.accessLevel)


# TODO: This is an example. DO NOT DELETE.
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()

    # returns {logged_in_as: "<value>", access_token: "<value>"}
    return jsonify(logged_in_as=current_user), 200

# TODO: not used. Alternative: localStorage.removeItem("token")


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/set-registration-status", methods=['POST'])
@jwt_required()
def set_registration_status():
    email = request.json['email']
    isApproved = request.json['isApproved']

    print(
        f'REQUEST.JSON: email: {email}, approved? {isApproved}', file=sys.stderr)

    public_user = User.query.filter_by(email=email).first()
    if isApproved:
        public_user.isValid = True
        db.session.add(public_user)
    else:
        # public_user.isValid = False
        db.session.delete(public_user)

    db.session.commit()

    return jsonify({'Request': 'OK'})
    # return get_registration_requests()


@app.route("/get-registration-requests", methods=['GET'])
@jwt_required()
def get_registration_requests():
    users = User.query.filter(User.email_confirmed ==
                              True, User.isValid == False).all()

    validUsers = []
    for user in users:
        print(user, file=sys.stderr)
        if user.email_confirmed:
            validUsers.append(dict(username=user.username,
                                   email=user.email, accessLevel=user.accessLevel,))

    return jsonify({"validUsers": validUsers})


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

# TODO: This is an example for sending emails. DO NOT DELETE.
# @app.route("/send-email", methods=['GET'])
# def send_email():
#     msg = Message('Hello from the other side!',
#                   sender='33acc45e679867', recipients=['33acc45e679867'])
#     msg.body = "Hey Paul, sending you this email from my Flask app, lmk if it works"
#     mail.send(msg)
#     return "Message sent!"


if __name__ == "__main__":
    app.run(debug=True)
