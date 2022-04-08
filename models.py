from os import access
from app import db, ma
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    accessLevel = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(40), nullable=False)

    # properties for email confirmation
    email_confirmation_sent_on = db.Column(db.DateTime, nullable=True)
    email_confirmed = db.Column(db.Boolean, nullable=True, default=False)
    email_confirmed_on = db.Column(db.DateTime, nullable=True)

    # Valid user?
    isValid = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.email_confirmation_sent_on = datetime.now()

    def __repr__(self):
        return f'User-> Email:{self.email}, Username:{self.username}, Access Level:{self.accessLevel}, Password:{self.password}'

# Generate marshmallow Schemas from your models


class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "username", "email", "accessLevel")


user_schema = UserSchema()
users_schema = UserSchema(many=True)

###########################################################
###################### INSTRUCTOR #########################
###########################################################


class Instructor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lastName = db.Column(db.String(30), nullable=False)
    firstName = db.Column(db.String(30), nullable=False)
    disciplineAreas = db.relationship(
        'InstructorDisciplineArea', backref='owning_instructor', lazy=True)
    maxLoad = db.Column(db.Integer, nullable=False, default=4)

    def __repr__(self):
        return f'INSTRUCTOR -> NAME: {self.firstName} {self.lastName}, disciplineAreas: {self.disciplineAreas}'


class InstructorSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "lastName", "firstName", "disciplineAreas", "maxLoad")


instructor_schema = InstructorSchema()
instructors_schema = InstructorSchema(many=True)


class InstructorDisciplineArea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey(
        'instructor.id'), nullable=False)


class InstructorDisciplineAreaSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "name", "instructor_id")


instructorDisciplineArea_schema = InstructorDisciplineAreaSchema()
instructorDisciplineAreas_schema = InstructorDisciplineAreaSchema(many=True)

########################################################
###################### COURSES #########################
########################################################


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    number = db.Column(db.Integer, nullable=False, unique=True)
    deptCode = db.Column(db.String(10), nullable=False)
    disciplineAreas = db.relationship(
        'CourseDisciplineArea', backref='owning_course', lazy=True)

    def __repr__(self):
        return f'COURSE -> NAME: {self.name}, NUMBER: {self.number}, DEPTCODE= {self.deptCode}, disciplineAreas: {self.disciplineAreas}'


class CourseSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "number", "deptCode", "disciplineAreas")


course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)


class CourseDisciplineArea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(
        'course.id'), nullable=False)


class CourseDisciplineAreaSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "course_id")


courseDisciplineArea_schema = CourseDisciplineAreaSchema()
courseDisciplineAreas_schema = CourseDisciplineAreaSchema(many=True)

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
