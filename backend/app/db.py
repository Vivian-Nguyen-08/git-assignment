from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os


# can get environment variables in the .env 
load_dotenv()
DATABASE_USER = os.getenv("POSTGRES_USER")
DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DATABASE_HOST = os.getenv("POSTGRES_HOST")
DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:5432/planora"

# creates connection to postgre 
engine = create_engine(DATABASE_URL, echo=True)
with engine.connect() as connection:
    print("Connected to PostgreSQL!")

def init_db():
    # looks at the models in models.py and all of the models with true will represent database tables
    # will then create the tables in the databases
    SQLModel.metadata.create_all(engine)

# gets the current session 
def get_session():
    with Session(engine) as session:
        yield session
