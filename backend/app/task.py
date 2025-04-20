from fastapi import APIRouter, Depends
from sqlmodel import Session, select, update

from typing import List

from app.db import get_session
from app.models import Task
from app.schema import TaskCreate, TaskRetreive
router = APIRouter()


# Creates a task with the TaskCreate schema to db
@router.post('/')
async def create_task(task: TaskCreate, session: Session = Depends(get_session)):
    new_task = Task(name=task.name, details=task.details)
    session.add(new_task)
    session.commit()
    return "Task Created"

# Fetches all the tasks in the DB as a list of taskretreive objects
@router.get("/", response_model=List[TaskCreate])
async def fetch_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(select(Task))
    ready_tasks = []
    for t in tasks.all():
        task = TaskRetreive(
            id = t.id,
            name = t.name,
            done = t.done,
            details = t.details
        )
        ready_tasks.append(task)
    return ready_tasks

# Marks the task as done or not done depending on the state given the task id in the url
@router.put("/{id}")
async def mark_task_done(id: int, session: Session = Depends(get_session)):
    task = session.exec(select(Task).where(Task.id == id)).first()
    if task.done == False:
        task.done = True
        session.add(task)
        session.commit()
        return "Task Marked Done"
    else:
        task.done = False
        session.add(task)
        session.commit()
        return "Task Marked Not Done"

# Delete a task given an id
@router.delete("/{id}")
async def delete_task(id: int, session: Session = Depends(get_session)):
    task = session.exec(select(Task).where(Task.id == id)).first()
    session.delete(task)
    session.commit()
    return "Task is removed."
