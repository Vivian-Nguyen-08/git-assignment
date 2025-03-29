from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from jose import JWTError, jwt
from app.db import get_session
from app.models import User, hash_password, pwd_context
from dotenv import load_dotenv
import os
from app.schema import UserCreate,UserLogin

#secret key that helps you get token
load_dotenv()  # load environment variables from .env
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in the environment variables!")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # token expiration time

# groups all authenticated routers 
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# verifies the password is correct 
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# gets the user 
def get_user(username: str, session: Session):
    return session.exec(select(User).where(User.username == username)).first()

# auth.py
@router.post("/register/")
async def register(user: UserCreate, session: Session = Depends(get_session)):
    # Check if the username already exists in the database
    existing_user = get_user(user.username, session)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check if the email already exists in the database
    existing_email = session.exec(select(User).where(User.email == user.email)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already in use")

    password_hash = hash_password(user.password)  # Hash the password

    # Create the new user based on the data
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=password_hash,  # Use the hashed password
        number=user.number,
        name=user.name,
        last_name=user.last_name
    )

    # Add the user to the database and commit the changes
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User created successfully", "user_id": new_user.id}

# verifies the users does exist by checking if the JWT token created in the past function actually exists 
@router.get("/users/me") #user calls this endpoint to fetch their own profile 
def read_users_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) #decodes the JWT token to get user info 
        username: str = payload.get("sub") #gets the subject field in the token, which is username 
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user = get_user(username, session)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": user.username, "email": user.email}
