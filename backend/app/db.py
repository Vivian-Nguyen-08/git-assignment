from sqlmodel import SQLModel, create_engine, Session 
from dotenv import load_dotenv
import os


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL") 
#create engine 
engine = create_engine(DATABASE_URL, echo=True)

def init_db(): 
    #looks at the models in models.py and all of the models with true will represent database tables 
    #will then create the tables in the databases 
    SQLModel.metadata.create_all(engine)
    
def get_session(): 
    with Session(engine) as session: 
        yield session 