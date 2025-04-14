from app.models import User, Group
from app.schema import GroupCreate
from app.auth import get_current_user
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.db import get_session

#gets router from fastapi 
router = APIRouter()
# create a Group
@router.post("/group", response_model=GroupCreate)
async def createGroup(
    group: GroupCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
): 
    #check if the group already exists
    existing_group = session.exec(select(Group).where(Group.name == group.name)).first()
    if existing_group: 
        raise HTTPException(status_code=400, detail="Group already exists")
    
    #check if group name already exists
    existing_groupName = session.exec(select(Group).where(Group.name == group.name)).first()
    if existing_groupName: 
        raise HTTPException(status_code=400, detail="Group name already exists")
    
    #create the group based on the data 
    new_group = Group(
        name=group.name,
        description=group.description, 
        fromDate=group.fromDate,
        toDate=group.toDate,
        invites=group.invites, 
        img=group.img
    ) 
    
    current_user.groups.append(new_group)
    
    #save changes to database
    session.add(new_group)
    session.add(current_user)
    session.commit()
    session.refresh(new_group)
    
    return new_group
    