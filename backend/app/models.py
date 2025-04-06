from sqlmodel import SQLModel, Field
from passlib.context import CryptContext

# password hashing context 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# creates a user table with the information username, email, password_hash, number, name, and last name 
class User(SQLModel,table=True): 
    id: int = Field(default=None,primary_key=True)
    username: str = Field(unique=True,nullable=False)
    email: str = Field(unique=True,nullable=False)
    password_hash: str = Field(nullable=False)
    number: str = Field(unique=True,nullable=False)
    name: str = Field(nullable=False)
    last_name: str = Field(nullable=False)

    
# returns the hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# verify password is correct 
""" def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password) """
