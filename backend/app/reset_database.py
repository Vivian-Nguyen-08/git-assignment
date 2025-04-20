# reset_db.py

from sqlmodel import SQLModel, create_engine
from models import User, Group, UserGroupLink  # Adjust the import to your actual model file
from dotenv import load_dotenv
import os


# helps to get access to variables inside of the .env 
load_dotenv()
DATABASE_USER = os.getenv("POSTGRES_USER")
DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DATABASE_HOST = os.getenv("POSTGRES_HOST")
DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}/planora2"


engine = create_engine(DATABASE_URL, echo=True)

def reset_database():
    print("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("Creating all tables...")
    SQLModel.metadata.create_all(engine)
    print("Database reset complete!")

if __name__ == "__main__":
    reset_database()
