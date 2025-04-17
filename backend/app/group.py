from app.models import User, Group, UserGroupLink
from app.schema import GroupCreate,GroupResponse,UserResponse
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
    
    
    groups = current_user.groups 
    for groupIndex in groups: 
        if groupIndex.name == group.name: 
            raise HTTPException(status_code=400, detail="User already in this group")
    
    # Create the group based on the data 
    new_group = Group(
        name=group.name,
        description=group.description, 
        fromDate=group.fromDate,
        toDate=group.toDate,
        img=group.img,
        members=[]
        
    )
    
    # Add invited users by email
    invites_emails = group.invites
    for email in invites_emails:  # GroupCreate expects emails as strings
        invited_user = session.exec(select(User).where(User.email == email)).first()
        if not invited_user:
         raise HTTPException(status_code=400, detail="User does not exist")
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
        ,"members": []  
    }

    return GroupResponse(**response)

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


@router.get("/details/{group_id}")
async def get_group_details(group_id: int, session: Session = Depends(get_session)):
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    response = {
        "name": group.name,
        "description": group.description,
        "fromDate": group.fromDate,
        "toDate": group.toDate,
        "img": group.img,
        "invites": [user.email for user in group.invites]
    }

    return response
    



@router.post("/addMembers/", response_model=GroupResponse)
async def add_members(group_id: int, user_data: dict, session: Session = Depends(get_session)):
    # Accept a dictionary with email field
    email = user_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Find or create user by email
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User not found: {email}")
    
    if user not in group.invites:
        group.invites.append(user)

    session.add(group)
    session.commit()
    session.refresh(group)
    
    # Return structured response with User objects converted to expected format
    response = {
        "name": group.name,
        "description": group.description,
        "fromDate": group.fromDate,
        "toDate": group.toDate,
        "img": group.img,
        "invites": [user.email for user in group.invites]  # Still convert to emails for the response
    }

    return response

@router.post("/removeMembers/", response_model=GroupResponse)
async def remove_member(group_id: int, user_data: dict, session: Session = Depends(get_session)):
    # Accept a dictionary with email field
    email = user_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Find user by email
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User not found: {email}")

    if user in group.invites:
        group.invites.remove(user)

    session.add(group)
    session.commit()
    session.refresh(group)
    
    # Return structured response with User objects converted to expected format
    response = {
        "name": group.name,
        "description": group.description,
        "fromDate": group.fromDate,
        "toDate": group.toDate,
        "img": group.img,
        "invites": [user.email for user in group.invites]  # Still convert to emails for the response
    }

    return response