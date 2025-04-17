from app.models import User, Group, UserGroupLink
from app.schema import GroupCreate,GroupResponse,AddMembersRequest
from app.auth import get_current_user
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.db import get_session
from sqlalchemy.orm import selectinload


#gets router from fastapi 
router = APIRouter()
# create a Group
@router.post("/group/", response_model=GroupResponse)  
async def createGroup(group: GroupCreate,session: Session = Depends(get_session),current_user: User = Depends(get_current_user)): 
    # Check if the group already exists
    existing_group = session.exec(select(Group).where(Group.name == group.name)).first()
    if existing_group: 
        raise HTTPException(status_code=400, detail="Group already exists")
    
    # Create the group based on the data 
    new_group = Group(
        name=group.name,
        description=group.description, 
        fromDate=group.fromDate,
        toDate=group.toDate,
        img=group.img
    )
    
    # Add invited users by email
    invites_emails = group.invites
    for email in invites_emails:  # GroupCreate expects emails as strings
        invited_user = session.exec(select(User).where(User.email == email)).first()
        if invited_user:
            new_group.invites.append(invited_user)  # Add User objects to the invites
    
    # Save changes to database
    session.add(new_group)
    session.commit()
    session.refresh(new_group)
    
    # Return only the emails of the invited users (not the User objects)
    invite_emails = [user.email for user in new_group.invites]
    new_group_data = group.dict()  # Convert the Pydantic model to a dictionary
    new_group_data['invites'] = invite_emails  # Add the emails to the invites field
    
    link = UserGroupLink(user_id=current_user.id, group_id=new_group.id)
    session.add(link)  
    session.commit()
    
    #have to do this because before it was sending it as a list of Users but only want emails 
    # Don't use new_group directly in the response or it will include User objects
    response = {
        "name": new_group.name,
        "description": new_group.description,
        "fromDate": new_group.fromDate,
        "toDate": new_group.toDate,
        "img": new_group.img,
        "invites": [user.email for user in new_group.invites]  # Convert User objects to email strings
    }

    return response

@router.get("/my-groups/")
async def get_my_groups(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # ensure that the current_user object is refreshed
    session.refresh(current_user)

    # select the User along with related groups and invited_groups using SQLModel
    statement = select(User).where(User.id == current_user.id)
    result = session.exec(statement)
    user = result.one()

    # prepare the response for invited_groups and groups
    return {
        "invited_groups": [
            {
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "fromDate": group.fromDate,
                "toDate": group.toDate,
                "img": group.img
            }
            for group in user.invited_groups  # Use user.invited_groups directly
        ],
        "groups": [
            {
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "fromDate": group.fromDate,
                "toDate": group.toDate,
                "img": group.img
            }
            for group in user.groups  # Use user.groups directly
        ]
    }




@router.post("/addMembers/", response_model=GroupResponse)
async def add_members(group_id: int, email: str, session: Session = Depends(get_session)):
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User not found: {email}")
    if user not in group.invites:
        group.invites.append(user)

    session.add(group)
    session.commit()
    session.refresh(group)

    return group 

@router.post("/removeMembers/", response_model=GroupResponse)
async def remove_member(group_id: int, email: str, session: Session = Depends(get_session)):
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user in group.invites:
        group.invites.remove(user)  

    session.add(group)
    session.commit()  
    session.refresh(group)

    return group 
    
    