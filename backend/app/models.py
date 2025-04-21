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
    name: str = Field(nullable=False)
    description: str = Field(nullable=False)
    fromDate: str = Field(nullable=False)
    toDate: str = Field(nullable=False)
    img: str = Field(nullable=True)
    archived: bool = Field(default=False)
    favorite: bool = Field(default=False)
    uploads: list["Upload"] = Relationship(back_populates="group")

    # Many-to-many relationship with User through UserGroupLink table
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

class Upload(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    data: bytes = Field(nullable=False)
    group_id: int | None = Field(nullable=False, foreign_key="group.id")
    group: Group = Relationship(back_populates='uploads')

class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    done: bool = Field(default=False, nullable=False)
    details: str = Field(nullable=False)

# returns the hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
