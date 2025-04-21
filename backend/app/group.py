from app.models import User, Group, UserGroupLink
from app.schema import GroupCreate,GroupResponse,UserResponse,GroupResponseArchived,GroupResponseFavorites
from app.auth import get_current_user
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.db import get_session
from sqlalchemy.orm import selectinload
import sys
import os





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
        img=group.img
        
    )
    
    # Add member users by email
    members_emails = group.members
    for email in members_emails:  # GroupCreate expects emails as strings
        members_user = session.exec(select(User).where(User.email == email)).first()
        if not members_user:
         raise HTTPException(status_code=400, detail= f"User '{email}' does not exist")
        if members_user:
            new_group.members.append(members_user)  # Add User objects to the members
    
    # Save changes to database
    session.add(new_group)
    session.commit()
    session.refresh(new_group)
    
    # Return only the emails of the members users (not the User objects)
    members_emails = [user.email for user in new_group.members]
    new_group_data = group.dict()  # Convert the Pydantic model to a dictionary
    new_group_data['members'] = members_emails # Add the emails to the members field
    
    link = UserGroupLink(user_id=current_user.id, group_id=new_group.id)
    session.add(link)
    session.commit()

    #have to do this because before it was sending it as a list of Users but only want emails
    # Don't use new_group directly in the response or it will include User objects
    response = {
        "id": new_group.id,
        "name": new_group.name,
        "description": new_group.description,
        "fromDate": new_group.fromDate,
        "toDate": new_group.toDate,
        "img": new_group.img,
        "members": [user.email for user in new_group.members]  # Convert User objects to email strings
    }

    """   await manager.broadcast({
        "event": "new_group",  # Event type for identifying the message
        "data": response  # The actual group data to send
    }) """
    
    return GroupResponse(**response)

@router.get("/my-groups/")
async def get_my_groups(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # ensure that the current_user object is refreshed
    session.refresh(current_user)

    # select the User along with related groups and member_groups using SQLModel
    statement = select(User).where(User.id == current_user.id)
    result = session.exec(statement)
    user = result.one()

    groups = user.groups
    #invited_groups = user.invited_groups
    
    # filters out archived groups
    groups = [group for group in groups if not group.archived]
   # invited_groups = [group for group in invited_groups if not group.archived]
    # prepare the response for and groups
    return {
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

@router.post("/accept-invite/{group_id}/")
async def accept_invite(group_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Fetch group
    group = session.exec(select(Group).where(Group.id == group_id)).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Check if user is invited
    if current_user not in group.invites:
        raise HTTPException(status_code=403, detail="You are not invited to this group")

    # Remove user from invites
    group.invites.remove(current_user)

    # Add user to UserGroupLink if not already a member
    existing_link = session.exec(
        select(UserGroupLink).where(
            UserGroupLink.user_id == current_user.id,
            UserGroupLink.group_id == group.id
        )
    ).first()

    if not existing_link:
        link = UserGroupLink(user_id=current_user.id, group_id=group.id)
        session.add(link)

    session.commit()

    return {"detail": "Invite accepted successfully."}


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
        "members": [user.email for user in group.members]
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
        raise HTTPException(status_code=404, detail= f"User '{email}' does not exist")
    
    if user not in group.members:
        group.members.append(user)

    session.add(group)
    session.commit()
    session.refresh(group)
    
    # Return structured response with User objects converted to expected format
    response = {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "fromDate": group.fromDate,
        "toDate": group.toDate,
        "img": group.img,
        "members": [user.email for user in group.members]  # Still convert to emails for the response
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
        raise HTTPException(status_code=404, detail= f"User '{email}' does not exist")

    if user in group.members:
        group.members.remove(user)

    session.add(group)
    session.commit()
    session.refresh(group)
    
    # Return structured response with User objects converted to expected format
    response = {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "fromDate": group.fromDate,
        "toDate": group.toDate,
        "img": group.img,
        "members": [user.email for user in group.members]  # Still convert to emails for the response
    }

    return response
@router.put("/archive/{group_id}")
async def toggle_archive_status( group_id: int,archive: bool,  session: Session = Depends(get_session),current_user: User = Depends(get_current_user)
):
   
    group = session.exec(select(Group).where(Group.id == group_id)).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    group.archived = archive
    session.commit()
    session.refresh(group)
    
    
    return {"message": "Archive updated successfully"}

@router.get("/my-archived-groups/")
async def get_my_archived_groups(current_user: User = Depends(get_current_user),session: Session = Depends(get_session)):
    # Ensure that the current_user object is refreshed
    session.refresh(current_user)

 
    statement = select(User).where(User.id == current_user.id)
    result = session.exec(statement)
    user = result.one()

    # Filter to only include archived groups
    archived_groups = [group for group in user.groups if group.archived]
   

    # Prepare the response
    return {
        "archived_groups": [
            {
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "fromDate": group.fromDate,
                "toDate": group.toDate,
                "img": group.img,
                "archived": group.archived
            }
            for group in archived_groups
        ]
    }
    
@router.put("/favorites/{group_id}")
async def toggle_archive_status( group_id: int,favorite: bool,  session: Session = Depends(get_session),current_user: User = Depends(get_current_user)
):
   
    group = session.exec(select(Group).where(Group.id == group_id)).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
   
    

    group.favorite = favorite
    session.commit()
    session.refresh(group)
    
    
    return {"message": "Favorite updated successfully"}

@router.get("/my-favorite-groups/")
async def get_my_favorite_groups(current_user: User = Depends(get_current_user),session: Session = Depends(get_session)):
    # Ensure that the current_user object is refreshed
    session.refresh(current_user)

 
    statement = select(User).where(User.id == current_user.id)
    result = session.exec(statement)
    user = result.one()

    # Filter to only include archived groups
    archived_groups = [group for group in user.groups if group.favorite]
   

    # Prepare the response
    return {
        "favorite_groups": [
            {
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "fromDate": group.fromDate,
                "toDate": group.toDate,
                "img": group.img,
                "archived": group.archived,
                "favorite": group.favorite
            }
            for group in archived_groups
        ]
    }