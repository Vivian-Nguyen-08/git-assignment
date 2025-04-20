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
        from_attributes = True 

# Model to be returned to client, all we need to do is confirm it happened, no pw needed 
class UserOut(BaseModel): 
    user_id: int
    username: str

        
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

class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    fromDate: str
    toDate: str
    img: Optional[str] = None
    members: list[str] = []
    class Config:
        from_attributes = True  
        
class GroupResponse(BaseModel):
    id: int
    name: str
    description: str
    fromDate: str
    toDate: str
    img: Optional[str] = None
    members: list[str] = [] 
    class Config:
        from_attributes = True
        
class GroupResponseArchived(BaseModel):
    name: str
    description: str
    fromDate: str
    toDate: str
    invites: list[str]
    img: Optional[str] = None
    archived: bool 

    class Config:
        from_attributes = True



class UserUpdate(BaseModel):
    name: str
    last_name: str

class TaskCreate(BaseModel):
    name: str
    details: str

class TaskRetreive(BaseModel):
    id: int
    name: str
    done: bool
    details: str
