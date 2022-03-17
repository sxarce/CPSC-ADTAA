import logging
from flask import current_app,jsonify,request
from flask_cors import cross_origin
from app import create_app,db
# from models import Articles,articles_schema
from models import User, users_schema, user_schema




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
	return "<h1>hello world</h1>"

@app.route("/register-user", methods=["POST"], strict_slashes=False)
@cross_origin()
def register_user():
    # title = request.json['title']
    # body = request.json['body']

    # article = Article(
    #     title=title,
    #     body=body
    #     )

	# db.session.add(new_user)
    # db.session.commit()

    # return article_schema.jsonify(article)
	
	username = request.json['username']
	email = request.json['email']
	password = request.json['password']
	accessLevel = request.json['accessLevel']
	new_user = User(username=username, email=email, password=password, accessLevel=accessLevel)
	
	db.session.add(new_user)
	db.session.commit()

	# DELETE ALL ENTRIES FROM DB (On submit form)
	# db.session.query(User).delete()
	# db.session.commit()

	return user_schema.jsonify(new_user)
    


if __name__ == "__main__":
	
	app.run(debug=True)