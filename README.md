
**Setting up** (Updated 3/25/22)

Inside VSCode, open 2 terminals. One for backend (```cd backend```), one for frontend.

In "Backend terminal":
- Create a virtual environment (venv) and activate it
```
python -m venv venv
venv/Scripts/activate
```
- Install dependencies/libraries (*Optional* - check if correct dependencies alrady exist ```pip list``` or ```python -m pip list```)
```
pip install -r requirements.txt
```

- Run the backend
``` python -m flask run ``` or ``` flask run ```

In "Frontend terminal":
```
npm install
npm start
```

----------------- Issues -----------------

***Import could not be resolved from source***
- Inside VSCode command palette (```Ctrl + Shift + P```), find *Python: Select Interpeter*
- Select, *Enter interpreter path*
- Navigate to and select *CPSC-ADTAA/venv/Scripts/python.exe*


***No pyvenv.cfg***
- Create a virtual environment and activate
``` 
python -m venv venv
venv/Scripts/activate
```

***database errors***

- Initialize database: 

```python manage.py```

- Deleting database entries:

Comment out *db.create_all()*. Uncomment *db.drop_all* (in manage.py)
Then, ```python manage.py```



***Testing email confirmation***

Create mailtrap account. The free version only.
In app.py:
- Change *app.config['MAIL_USERNAME]* and *app.config['MAIL_PASSWORD']* to your mailtrap credentials (SMTP Settings > Integrations > Flask-Mail
