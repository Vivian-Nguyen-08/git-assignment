from pydantic import BaseModel, EmailStr
from typing import Optional

# pydantic model for the request (Signup data)
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    number: str
    name: str
    last_name: str

    class Config:
        orm_mode = True  # to tell Pydantic to treat the ORM models like dictionaries
        
# pydanic model for the request (Login data)
class UserLogin(BaseModel):
    username: str
    password: str
    
    class Config:
        orm_mode = True  # to tell Pydantic to treat the ORM models like dictionaries

# pydantic model for the response (User data after creation)
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    password:str 
    number: str
    name: str
    last_name: str

    class Config:
        orm_mode = True  # to convert ORM models to Pydantic models
