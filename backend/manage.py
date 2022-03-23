# python manage.py (do before flask run)

def deploy():
	"""Run deployment tasks."""
	from app import create_app,db
	from flask_migrate import upgrade,migrate,init,stamp
	from models import User

	app = create_app()
	app.app_context().push()

	# create database and tables
	db.create_all()

	# deletes all tables --> useful after editing columns from child classes of db.Model 
	# db.drop_all()
	

	# migrate database to latest revision
	stamp()
	migrate()
	upgrade()
	
deploy()
	
# Error: Working outside of application context.

# This typically means that you attempted to use functionality that needed
# to interface with the current application object in some way. To solve
# this, set up an application context with app.app_context().  See the
# documentation for more information.