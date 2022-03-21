
**Setting up** (Updated 3/21/22)

Inside VSCode, open 2 terminals. One for backend (```cd backend```), one for frontend.

In "Backend terminal":
- Create a virtual environment (venv) and activate it
```
python -m venv venv
venv/Scripts/activate
```
- Install dependencies/libraries
```
pip install -r requirements.txt
```

- Run the backend
```
python -m flask run
```

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

