from flask import current_app, flash, jsonify, request, redirect
from flask_cors import cross_origin
from app import create_app, db, mail


from models import User, users_schema, user_schema
from models import Instructor, instructor_schema, instructors_schema
from models import InstructorDisciplineArea, instructorDisciplineArea_schema, instructorDisciplineAreas_schema
from models import Course, course_schema, courses_schema
from models import CourseDisciplineArea, courseDisciplineArea_schema, courseDisciplineAreas_schema
from models import Section, section_schema, sections_schema
from models import MeetingPeriod, meetingPeriod_schema, meetingPeriods_schema
from models import PartialSchedule, partialSchedule_schema, partialSchedules_schema
from models import AssignedClass, assignedClass_schema, assignedClasses_schema
from flask_login import login_user

import sys

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import unset_jwt_cookies, get_jwt

import json
from datetime import timedelta, timezone, datetime
from dateutil import tz
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

    msg = Message(subject='CPSC-ADTAA: Confirm Your Email Address',
                  html=render_template(
                      'email_confirmation.html', confirm_url=confirm_url),
                  recipients=[user_email], sender=app.config['MAIL_USERNAME'])

    return mail.send(msg)

# Needed by section routes.


def convert_utc_to_cst(utc_time):
    from_zone = tz.gettz('UTC')
    to_zone = tz.gettz('America/Chicago')

    utc = datetime.strptime(utc_time, '%Y-%m-%dT%H:%M:%S.%fZ')
    utc = utc.replace(tzinfo=from_zone)
    return utc.astimezone(to_zone)

#############################################
################## routes ###################
#############################################


@app.route("/generate-schedule", methods=['GET', 'POST'])
def generate_schedule():

    # CONSTRAINT: SHOULDNT modify DB directly.
    # SOLUTION: Instead match everything here, create assigned classes and push as schedule
    # ALTERNATIVE: CAN modify DB directly.
    # sortedInstructorRoster[0].maxLoad = 4
    # db.session.commit() to save changes in db.

    # REMINDERS:
    # (1) ACCESSING SECTIONS FROM COURSE
    # for course in Course.query.all():
    #     print(f'{course.sections}', file=sys.stderr)

    # (2) ACCESSING COURSE  FROM SECTION
    # for section in sectionsList:
    #     print(f'{section.owning_course}', file=sys.stderr)

    # (3) ACCESSING INSRUCTORS FROM SECTION
    # for section in Section.query.all():
    #     print(f'{section.assignedInstructor}', file=sys.stderr)

    # (A) ACCESSING TIME
    # type(section.meetingPeriods[0].endTime) === datetime.datetime
    # timeOnly = sectionsList[0].meetingPeriods[0].endTime.replace(microsecond=0).time()
    #
    # if sectionsList[0].meetingPeriods[0].startTime.replace(microsecond=0).time() < sectionsList[0].meetingPeriods[0].endTime.replace(microsecond=0).time():
    #     print(f'startTime less than endTime', file=sys.stderr)

    # (B) MUTATE INSTRUCTOR COPY
    # sortedInstructorRoster[0].maxLoad = 3
    # print(f'{sortedInstructorRoster}', file=sys.stderr)

    # PLAN:
    # PartialSchedule contains a list of Pair<Section, Instructor>
    # The pair is a db.Model (AssignedClass) which belongs to a specific PartialSchedule
    # Create assigned classes by passing in both instructor and section ID's
    # Pass in owning_schedule

    # POTENTIAL ISSUES: Foreign key contraint (deleting an instructor/section MAY become an issue)

    sortedInstructorRoster = sorted(Instructor.query.all(
    ), key=lambda instructor: len(instructor.disciplineAreas))
    sectionsList = Section.query.all()

    new_schedule = PartialSchedule()
    db.session.add(new_schedule)

    # print(f'{sectionsList}', file=sys.stderr)

    instructorsToDelete = []
    for section in sectionsList:
        for instructor in sortedInstructorRoster:
            if instructor.maxLoad > 0:
                # iterate through sections wherein instructor is assigned. check if overlap
                if hasMatchingDisciplineAreas(section.owning_course.disciplineAreas, instructor.disciplineAreas):
                    if not hasSectionOverlap(section, instructor.sections):
                    # create assignedClass AND associate it to PartialSchedule
                        new_assigned_class = AssignedClass(
                            owning_section=section, owning_instructor=instructor, owning_schedule=new_schedule)
                        db.session.add(new_assigned_class)
                        print(f'{new_schedule}', file=sys.stderr)
                        # Update maxload
                        instructor.maxLoad -= 1
                        # Break out of inner loop. Section assigned.
                        break
            else:
                instructorsToDelete.append(instructor.id)

        # Update sortedInstructorRoster with those in instructorsToDelete
        sortedInstructorRoster = [
            availableInstructor for availableInstructor in sortedInstructorRoster if availableInstructor.id not in instructorsToDelete]

    # TODO: Return result and commit.

    resetMaxLoad()
    db.session.commit()

    return {"Message": "Okay", }

def resetMaxLoad():
    instructorRoster = Instructor.query.all()
    for instructor in instructorRoster:
        instructor.maxLoad = 4


def hasSectionOverlap(sectionToAssign, instructorSections):
    '''Find overlap between 2 sections.

    Keyword arguments: 

    \n\tsectionToAssign -- the section to assign 
    \n\tinstructorSections -- a list of sections associated with an instructor.
    '''
    for assignedSection in instructorSections:
        if isOverlapping(sectionToAssign, assignedSection):
            return True

    return False


def isOverlapping(sectionToAssign, assignedSection):
    '''Helper function for hasSectionOverlap(). Accepts exactly 2 sections as arguments.'''
    # CALLS hasTimeConflict. This function will only compare x section to y section. (ONLY 1v1.)
    assignedMeetingPeriods = [
        meetingPeriod for meetingPeriod in assignedSection.meetingPeriods]

    for assignedMeetPeriod in assignedMeetingPeriods:
        for sectionMeetPeriod in sectionToAssign.meetingPeriods:
            if hasTimeConflict(meetingPeriodToAssign=sectionMeetPeriod, assignedMeetingPeriod=assignedMeetPeriod):
                return True

    return False


def hasTimeConflict(meetingPeriodToAssign, assignedMeetingPeriod):
    '''Helper function for isOverlapping(). Accepts exactly 2 meeting_periods as arguments'''

    return (assignedMeetingPeriod.startTime.replace(microsecond=0).time() <
            meetingPeriodToAssign.startTime.replace(microsecond=0).time()
            < assignedMeetingPeriod.endTime.replace(microsecond=0).time())


def hasMatchingDisciplineAreas(sectionDisciplineAreas, instructorDisciplineAreas):
    '''Used for matching discipline areas between sections.course and instructor'''
    sectionDisciplineAreasNames = [da.name for da in sectionDisciplineAreas]
    instructorDisciplineAreasNames = [
        da.name for da in instructorDisciplineAreas]

    for instructorDA in instructorDisciplineAreasNames:
        if instructorDA in sectionDisciplineAreasNames:
            return True

    return False


@app.route("/delete-instructor", methods=['GET', 'POST'])
@jwt_required()
def delete_instructor():
    # print(f'{request.json["instructorLastName"]}', file=sys.stderr)
    instructorLastName = request.json['instructorLastName']
    instructorFirstName = request.json['instructorFirstName']

    instructorToDelete = Instructor.query.filter_by(
        lastName=instructorLastName, firstName=instructorFirstName).first()
    # print(f'{instructorToDelete.id}', file=sys.stderr)

    # Does not automatically delete all unlike one-to-one 4/24/22
    for disciplineArea in instructorToDelete.disciplineAreas:
        db.session.delete(disciplineArea)

    db.session.delete(instructorToDelete)
    db.session.commit()

    return {"Message": "Instructor deleted"}


@app.route("/delete-course", methods=['GET', 'POST'])
@jwt_required()
def delete_course():
    courseName = request.json['courseName']
    courseNumber = request.json['courseNumber']

    courseToDelete = Course.query.filter_by(
        name=courseName, number=courseNumber).first()
    print(f'{courseToDelete}', file=sys.stderr)

    # delete DISCIPLINEAREAS associated with COURSE
    for disciplineArea in courseToDelete.disciplineAreas:
        db.session.delete(disciplineArea)

    # delete SECTIONS associated with COURSE
    for section in courseToDelete.sections:
        for meetingPeriod in section.meetingPeriods:
            db.session.delete(meetingPeriod)
        db.session.delete(section)

    db.session.delete(courseToDelete)
    db.session.commit()

    return {"Message": "Course deleted"}


@app.route("/get-instructors-roster")
@jwt_required()
def get_instructors():
    instructorRoster = Instructor.query.all()

    if not instructorRoster:
        return {"Request": "OK", "TableData": ""}

    # Solves: Object is not JSON serializable. Serialize instructors. Then serialize each of their disciplineAreas.
    serialized_instructor_roster = instructors_schema.dump(
        instructorRoster)

    for instructor in serialized_instructor_roster:
        instructor['disciplineAreas'] = instructorDisciplineAreas_schema.dump(
            instructor['disciplineAreas'])

    # print(f'{serialized_instructor_roster}', file=sys.stderr)
    # NOTE: This might be an initial step when designing the assistant algorithm.
    return {"Request": "OK", "TableData": serialized_instructor_roster}


@app.route("/get-course-list")
@jwt_required()
def get_courses():
    courseList = Course.query.all()  # returns empty list if table is empty.

    # If no courses available
    if not courseList:
        return {"Request": "OK", "TableData": courseList}

    serialized_course_list = courses_schema.dump(
        courseList)

    for course in serialized_course_list:
        course['disciplineAreas'] = courseDisciplineAreas_schema.dump(
            course['disciplineAreas'])

    return {"Request": "OK", "TableData": serialized_course_list}


@app.route("/add-instructor", methods=['GET', 'POST'])
@jwt_required()
def add_instructor():
    # TODO: FIX: This add-instructor() route will eventually generate disciplineAreas with ID's that are greater than a million.
    # print(f'{request.json["tableData"]}', file=sys.stderr)

    tableData = request.json["tableData"]
    editInstructorID = request.json["editInstructorID"]
    # print(f'{editInstructorID}', file=sys.stderr)

    # If (ADDING INSTRUCTOR)
    if editInstructorID == -1:
        instructorToAdd = tableData[len(tableData) - 1]

        new_instructor = Instructor(
            lastName=instructorToAdd['lastName'], firstName=instructorToAdd['firstName'])
        db.session.add(new_instructor)

        for disciplineArea in instructorToAdd['expertise']:
            new_discipline_area = InstructorDisciplineArea(
                name=disciplineArea, owning_instructor=new_instructor)
            db.session.add(new_discipline_area)
    # else (EDITING INSTRUCTOR)
    else:
        instructorToEdit = Instructor.query.filter_by(
            id=editInstructorID).first()

        modifiedInstructor = tableData[request.json['instructorToEditIndex']]

        for disciplineArea in instructorToEdit.disciplineAreas:
            db.session.delete(disciplineArea)

        # db.session.commit() # THE CULPRIT!!! database error displays empty textfield

        # Make changes to existing instructor
        instructorToEdit.lastName = modifiedInstructor['lastName']
        instructorToEdit.firstName = modifiedInstructor['firstName']

        for disciplineArea in modifiedInstructor['expertise']:
            new_discipline_area = InstructorDisciplineArea(
                name=disciplineArea, owning_instructor=instructorToEdit)
            db.session.add(new_discipline_area)

    db.session.commit()

    return jsonify({'Message': f'Instructor added/modified!'})


@app.route("/add-course", methods=['GET', 'POST'])
@jwt_required()
def add_course():

    tableData = request.json["tableData"]
    editCourseID = request.json["editCourseID"]
    print(f'{tableData}', file=sys.stderr)

    if editCourseID == -1:
        courseToAdd = tableData[len(tableData) - 1]

        new_course = Course(
            name=courseToAdd['courseName'], number=courseToAdd['courseNumber'],
            deptCode=courseToAdd['courseDeptCode'])
        db.session.add(new_course)

        for disciplineArea in courseToAdd['requiredExpertise']:
            new_discipline_area = CourseDisciplineArea(
                name=disciplineArea, owning_course=new_course)
            db.session.add(new_discipline_area)

    else:
        courseToEdit = Course.query.filter_by(
            id=editCourseID).first()

        modifiedCourse = tableData[request.json['courseToEditIndex']]

        for disciplineArea in courseToEdit.disciplineAreas:
            db.session.delete(disciplineArea)

        # db.session.commit() # THE CULPRIT!!! database error displays empty textfield

        # Make changes to existing course
        courseToEdit.name = modifiedCourse['courseName']
        courseToEdit.number = modifiedCourse['courseNumber']
        courseToEdit.deptCode = modifiedCourse['courseDeptCode']

        for disciplineArea in modifiedCourse['requiredExpertise']:
            new_discipline_area = CourseDisciplineArea(
                name=disciplineArea, owning_course=courseToEdit)
            db.session.add(new_discipline_area)

    db.session.commit()

    return jsonify({'Message': f'Course added/modified!'})


@app.route("/add-section", methods=['GET', 'POST'])
@jwt_required()
def add_section():
    # CONVERT JS toJSON() string to datetime (similar to email_confirmed_on)
    courseNumber = request.json['courseNumber']
    sectionNumber = request.json['sectionNumber']
    numMeetingPeriods = request.json['numMeetingPeriods']

    periodDays = [
        {"meetingPeriodDay": request.json['meetingPeriod1Day'],
         "meetingPeriodStart": convert_utc_to_cst(request.json['meetingPeriod1Start']),
            "meetingPeriodEnd": convert_utc_to_cst(request.json['meetingPeriod1End'])},

        {"meetingPeriodDay": request.json['meetingPeriod2Day'],
         "meetingPeriodStart": convert_utc_to_cst(request.json['meetingPeriod2Start']),
            "meetingPeriodEnd":convert_utc_to_cst(request.json['meetingPeriod2End'])},

        {"meetingPeriodDay": request.json['meetingPeriod3Day'],
         "meetingPeriodStart": convert_utc_to_cst(request.json['meetingPeriod3Start']),
            "meetingPeriodEnd": convert_utc_to_cst(request.json['meetingPeriod3End'])},
    ]

    owner = Course.query.filter_by(number=courseNumber).first()

    new_section = Section(sectionNumber=sectionNumber, owning_course=owner)
    db.session.add(new_section)

    # iterate based on numMeetingPeriods. request.json includes all input for meeting periods.
    for i in range(int(numMeetingPeriods)):
        new_meeting_period = MeetingPeriod(
            startTime=periodDays[i]['meetingPeriodStart'],
            endTime=periodDays[i]['meetingPeriodEnd'],
            meetDay=periodDays[i]['meetingPeriodDay'],
            owning_section=new_section,
        )
        db.session.add(new_meeting_period)

    db.session.commit()

    return get_sections()


@app.route("/get-sections")
@jwt_required()
def get_sections():
    sectionsList = Section.query.all()
    serialized_sections_list = sections_schema.dump(sectionsList)

    for section in serialized_sections_list:
        owning_course = Course.query.filter_by(id=section['course_id']).first()
        section['courseNumber'] = owning_course.number
        section['numMeetingPeriods'] = len(section['meetingPeriods'])

    for section in serialized_sections_list:
        section['meetingPeriods'] = meetingPeriods_schema.dump(
            section['meetingPeriods'])

    return {"Message": "Sections retrieved!", "TableData": serialized_sections_list}


@app.route("/update-section", methods=['GET', 'POST'])
@jwt_required()
def update_section():
    editSectionId = request.json['id']
    sectionToEdit = Section.query.filter_by(id=editSectionId).first()

    courseNumber = request.json['courseNumber']
    new_owner = Course.query.filter_by(number=courseNumber).first()
    sectionToEdit.owning_course = new_owner

    sectionNumber = request.json['sectionNumber']
    sectionToEdit.sectionNumber = sectionNumber

    periodDays = [
        {"meetingPeriodDay": request.json['meetingPeriod1Day'],
         "meetingPeriodStart": convert_utc_to_cst(request.json['meetingPeriod1Start']),
            "meetingPeriodEnd": convert_utc_to_cst(request.json['meetingPeriod1End'])},

        {"meetingPeriodDay": request.json['meetingPeriod2Day'],
         "meetingPeriodStart": convert_utc_to_cst(request.json['meetingPeriod2Start']),
            "meetingPeriodEnd":convert_utc_to_cst(request.json['meetingPeriod2End'])},
    ]

    numMeetingPeriods = int(request.json['numMeetingPeriods'])
    if numMeetingPeriods == 3:
        periodDays.append({"meetingPeriodDay": request.json['meetingPeriod3Day'],
                           "meetingPeriodStart": convert_utc_to_cst(request.json['meetingPeriod3Start']),
                           "meetingPeriodEnd": convert_utc_to_cst(request.json['meetingPeriod3End'])},)

    for meetingPeriod in sectionToEdit.meetingPeriods:
        db.session.delete(meetingPeriod)

    for i in range(int(numMeetingPeriods)):
        new_meeting_period = MeetingPeriod(
            startTime=periodDays[i]['meetingPeriodStart'],
            endTime=periodDays[i]['meetingPeriodEnd'],
            meetDay=periodDays[i]['meetingPeriodDay'],
            owning_section=sectionToEdit,
        )
        db.session.add(new_meeting_period)

    db.session.commit()

    return get_sections()


@app.route("/delete-section", methods=['GET', 'POST'])
@jwt_required()
def delete_section():
    sectionToDelete = Section.query.filter_by(id=request.json['id']).first()

    for meetingPeriod in sectionToDelete.meetingPeriods:
        db.session.delete(meetingPeriod)

    db.session.delete(sectionToDelete)

    db.session.commit()

    return get_sections()


@ app.route("/confirm/<token>")
def confirm_email(token):
    try:
        confirm_serializer = URLSafeTimedSerializer(
            current_app.config['SECRET_KEY'])
        email = confirm_serializer.loads(
            token, salt='email-confirmation-salt', max_age=3600)
    except BadSignature:
        # TODO: redirect template dead-end page
        print("The confirmation link is expired.", file=sys.stderr)
        # return '<p>The confirmation link is expired</p>'
        return render_template('dead_end_page.html', msg="This confirmation link is expired", affirm=False)

    existing_user = User.query.filter_by(email=email).first()

    if existing_user.email_confirmed:
        # TODO: Make template dead-end page to redirect to login (external url)
        # return '<p>Email already confirmed. Please wait for your registration request to be verified. </p>'
        return render_template('dead_end_page.html', msg="Email already confirmed. Please wait for your registration request to be verified.", affirm=False)
        # return redirect('http://localhost:3000/')
    else:
        existing_user.email_confirmed = True
        existing_user.email_confirmed_on = datetime.now()

        # supposedly UPDATES user
        db.session.add(existing_user)
        db.session.commit()
        # TODO: redirect to template dead-end page
        print('Thank you for confirming your email address. ', file=sys.stderr)
        # return '<p> Thank you for confirming your email address </p>'
        return render_template('dead_end_page.html', msg="Thank you for confirming your email address. Please wait for your registration request to be verified.", affirm=True)

    # return jsonify(logged_in_as=existing_user.email), 200
    # return '<p> email confirmed </p>'


@ app.route("/register-user", methods=["POST"], strict_slashes=False)
@ cross_origin()
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


@ app.route("/login-user", methods=['GET', 'POST'])
@ cross_origin()
def login_user():  # create_token()
    usernameInput = request.json['username']
    passwordInput = request.json['password']
    attempted_user = User.query.filter_by(username=usernameInput).first()
    if not attempted_user:
        attempted_user = User.query.filter_by(email=usernameInput).first()

    print(attempted_user, file=sys.stderr)

    if not attempted_user or attempted_user.password != passwordInput:
        return {"msg": "Wrong email or password"}, 401
    elif not attempted_user.isValid:
        return {"msg": "Invalid account. User with pending registration request."}, 401

    access_token = create_access_token(identity=usernameInput)

    return jsonify(access_token=access_token, email=attempted_user.email, accessLevel=attempted_user.accessLevel)


# TODO: This is an example. DO NOT DELETE.
@ app.route("/protected", methods=["GET"])
@ jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()

    # returns {logged_in_as: "<value>", access_token: "<value>"}
    return jsonify(logged_in_as=current_user), 200

# TODO: not used. Alternative: localStorage.removeItem("token")


@ app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@ app.route("/set-registration-status", methods=['POST'])
@ jwt_required()
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


@ app.route("/get-registration-requests", methods=['GET'])
@ jwt_required()
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
@ app.route("/credentials", methods=['GET'])
@ jwt_required()
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


@ app.after_request
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