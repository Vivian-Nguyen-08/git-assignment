from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from jose import JWTError, jwt
from app.db import get_session
from app.models import User, hash_password, pwd_context
from app.schema import UserCreate, UserLogin, Token
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login/")

# creates the access token to securely transfer information 
# creates an access token for the frontend to use 
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# verifies the password is correct 
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def verify_token(token: str, session: Session) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = get_user(username, session)  
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
   

# gets the user 
def get_user(username: str, session: Session):
    return session.exec(select(User).where(User.username == username)).first()



def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    user_data = verify_token(token, session)  # ✅ Pass session here
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user_data


# signs up a user and saves it onto the database 
@router.post("/register/",response_model=UserCreate)
async def register(user: UserCreate, session: Session = Depends(get_session)):
    # check if the username already exists in the database
    existing_user = get_user(user.username, session)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # check if the email already exists in the database
    existing_email = session.exec(select(User).where(User.email == user.email)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already in use")

    password_hash = hash_password(user.password)  # hash the password

    # create the new user based on the data
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=password_hash,  # use the hashed password
        number=user.number,
        name=user.name,
        last_name=user.last_name
    )

    # add the user to the database and commit the changes
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

# attempts to login the user into the session 
@router.post("/login/", response_model=Token)
async def login(user: UserLogin, session: Session = Depends(get_session)):
    # fetch the user from the database by username
    user_db = session.exec(select(User).where(User.username == user.username)).first()
    
    # check if the user exists and if the password is correct
    if not user_db or not verify_password(user.password, user_db.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password", 
                           headers={"WWW-Authenticate": "Bearer"})

    # create access token for the user if credentials are correct
    access_token = create_access_token(data={"sub": user_db.username})
    
    # return the access token and token type
    return Token(access_token=access_token, token_type="bearer")

# verifies the users does exist by checking if the JWT token created in the past function actually exists 
@router.get("/users/me") # user calls this endpoint to fetch their own profile 
def read_users_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # decodes the JWT token to get user info 
        username: str = payload.get("sub") # gets the subject field in the token, which is username 
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    # checks if the user exists and if it doesn't return user not found, but if it does exist return user information. 
    user = get_user(username, session)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": user.username, "email": user.email}

# deletes the user from the database when user wants to delete account 
@router.delete("/delete_account/")
def delete_account(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        # Decode the token and get the username
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    # Fetch user from the database
    user = get_user(username, session)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the user and commit
    session.delete(user)
    session.commit()

    return {"message": f"Account for user '{username}' has been deleted."}
