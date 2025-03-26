from sqlmodel import SQLModel, Field
from passlib.context import CryptContext

# password hashing context 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# creates a user table 
class User(SQLModel,table=True): 
    id: int = Field(default=None,primary_key=True)
    username: str = Field(unique=True,nullable=False)
    email: str = Field(unique=True,nullable=False)
    password_hash: str = Field(nullable=False)

    
# hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# verify password is correct 
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
