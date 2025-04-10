
## Setting up backend

You need `python3` installed on your system. As well as `pip`
https://www.python.org/downloads/
https://pip.pypa.io/en/stable/installation/
Navigate to  `/backend` of repository
Create a virtual environment:
https://python.land/virtual-environments/virtualenv
Once venv is created and activated, install all dependencies from requirements.txt with `pip install -r requirements.txt`

## Starting server and connecting to database

Inside the `/backend` directory copy `.env.sample` to `.env` and input the values from discord
Run the command `uvicorn main:app --reload` to start the API server locally(should connect to database immediately). 

