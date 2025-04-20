from sqlmodel import SQLModel, Field, Relationship
from passlib.context import CryptContext
from typing import List, Optional

# password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserGroupLink(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)
    group_id: Optional[int] = Field(default=None, foreign_key="group.id", primary_key=True)


class Group(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(unique=True, nullable=False)
    description: str = Field(nullable=False)
    fromDate: str = Field(nullable=False)
    toDate: str = Field(nullable=False)
    img: str = Field(nullable=True)

    # Many-to-many relationship with User through UserGroupLink table
    invites: List["User"] = Relationship(
        back_populates="invited_groups",
        link_model=UserGroupLink
    )
    members: List["User"] = Relationship(
        back_populates="groups",
        link_model=UserGroupLink
    )

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(unique=True, nullable=False)
    email: str = Field(unique=True, nullable=False)
    password_hash: str = Field(nullable=False)
    number: str = Field(unique=True, nullable=False)
    name: str = Field(nullable=False)
    last_name: str = Field(nullable=False)

    # Relationships
    groups: List[Group] = Relationship(
        back_populates="members",
        link_model=UserGroupLink
    )
    invited_groups: List[Group] = Relationship(
        back_populates="invites",
        link_model=UserGroupLink
    )

class Upload(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    data: bytes = Field(nullable=False)

class Tasks(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    done: bool = Field(nullable=False)
    details: str = Field(nullable=False)

# returns the hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
