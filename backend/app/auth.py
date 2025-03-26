from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from jose import JWTError, jwt
from app.db import get_session
from models import User, hash_password, pwd_context
from dotenv import load_dotenv
import os

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

# helps to register the user 
@router.post("/register/")
def register(username: str, email: str, password: str, session: Session = Depends(get_session)):
    existing_user = get_user(username, session)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_email = session.exec(select(User).where(User.email == email)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already in use")

    new_user = User(username=username, email=email, password_hash=hash_password(password))
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User created successfully", "user_id": new_user.id}

# user login and will create token with the login credientals 
@router.post("/login/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = get_user(form_data.username, session)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password", headers={"WWW-Authenticate": "Bearer"})

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

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
