from os import access
from app import db, ma
# from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(40), nullable=False)
    accessLevel = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(40), nullable=False)

    def __repr__(self):
        return f'User\n Email: {self.email}, Username: {self.username}, Access Level: {self.accessLevel}, Password: {self.password}'

# Generate marshmallow Schemas from your models
class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id","username", "email", "accessLevel")


user_schema = UserSchema()
users_schema = UserSchema(many=True)


# class Articles(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(100),nullable=False)
#     body = db.Column(db.Text, nullable=False)
#     date = db.Column(db.DateTime(), default=datetime.utcnow)


#     def __repr__(self):
#         return "<Articles %r>" % self.title

# # Generate marshmallow Schemas from your models
# class ArticlesShema(ma.Schema):
#     class Meta:
#         # Fields to expose
#         fields = ("id","title", "body", "date")


# article_schema = ArticlesShema()
# articles_schema = ArticlesShema(many=True)
