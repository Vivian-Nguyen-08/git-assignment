from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os
from pathlib import Path

# Load the environment variables from the .env file
load_dotenv()

# Path to the .env file - this will get the file in the backend folder
env_path = Path(__file__).resolve().parent.parent / '.env'  
load_dotenv(dotenv_path=env_path)

DATABASE_USER = os.getenv("POSTGRES_USER")
DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DATABASE_HOST = os.getenv("POSTGRES_HOST")
DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:5432/planora"

# Create the engine to connect to PostgreSQL database
engine = create_engine(DATABASE_URL, echo=True)

# Initialize the database connection and create tables based on models
def init_db():
    try:
        # Connect to PostgreSQL to check the connection
        with engine.connect() as connection:
            print("✅ Connected to PostgreSQL!")
        # Create the tables using the SQLModel metadata
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print("❌ Database connection failed:", e)

# Get the current session to interact with the database
def get_session():
    session = Session(engine)  # create a new session
    try:
        yield session  # yield the session to use in a context manager
    finally:
        session.close()  # ensure the session is closed after use
