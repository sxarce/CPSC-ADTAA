
**Setting up (Windows)** (Updated 3/27/22)

Inside VSCode, open 2 terminals. One for backend (```cd backend```), one for frontend.

In "Backend terminal":
- Create a virtual environment (venv) and activate it
```
python -m venv venv
venv/Scripts/activate
```
- Install dependencies/libraries (*Optional* - check if correct dependencies already exist ```pip list``` or ```python -m pip list```)
```
pip install -r requirements.txt
```

- Run the backend

``` 
python -m flask run 
``` 
or 
``` flask run ```

In "Frontend terminal", install dependencies and run:
```
npm install
npm start
```

------------------------------------------
**Setting up (MacOS)** (Updated 3/28/22)

Inside VSCode, open 2 terminals. One for backend (```cd backend```), one for frontend.

In "Backend terminal":
- Create a virtual environment (venv) and activate it
```
python3 -m venv venv
source venv/bin/activate
```

- (*Optional*) Ensure you have Homebrew installed (```brew --version```). Otherwise, do:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

- Install *node* and *mysql* (frontend and backend dependency requirements)
```
brew install node
brew install mysql
```



- (*Optional*) Install dependencies if they don't exist (```pip list``` to check):
``` 
pip install -r requirements.txt 
```

- Run the backend: 

```
flask run
```


In "Frontend terminal", install dependencies and run:

- (*Optional*) Ensure you have Homebrew installed (```brew --version```). Same in backend setup (If you've done this already, skip this part). Otherwise, do:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

- Install node (same in backend setup. skip if done)

```
brew install node
```

- Run the frontend:
```
npm install
npm start
```

------------------------------------------
***ISSUES***

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

Or, use *DB Browser for SQLite* to execute SQL statements.



***Testing email confirmation***

Create mailtrap account. The free version only.
In app.py:
- Change *app.config['MAIL_USERNAME]* and *app.config['MAIL_PASSWORD']* to your mailtrap credentials (SMTP Settings > Integrations > Flask-Mail