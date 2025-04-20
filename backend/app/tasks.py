from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_session
from app.schema import TaskCreate
router = APIRouter


@router.post('/')
async def create_task(task: TaskCreate, session: Session = Depends(get_session)):
