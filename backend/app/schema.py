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
    groups: Optional[list[str]] = [] 

    class Config:
        from_attributes = True 
        
# pydanic model for the request (Login data)
class UserLogin(BaseModel):
    username: str
    password: str
    
    class Config:
        from_attributes = True 

# Token response model
class Token(BaseModel):
    access_token: str
    token_type: str

# pydantic model for the response (User data after creation)
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    password: str
    number: str
    name: str
    last_name: str
    groups: Optional[list[str]] = []

    class Config:
        from_attributes = True  
        


class GroupCreate(BaseModel): 
    name: str
    description: str
    fromDate: str
    toDate: str
    invites: Optional[list[str]] = [] # List of user IDs or usernames for invites
    img: Optional[str] = None  # Optional field for the image URL
    class Config:
        from_attributes = True  
        
class GroupResponse(BaseModel): 
    name: str
    description: str
    fromDate: str
    toDate: str
    invites: list[str]  
    img: Optional[str] = None
    
    class Config:
        from_attributes = True