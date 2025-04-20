from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schema, models
from app.db import get_session as get_db
from app.auth import get_current_user  # assumes user is attached to token

router = APIRouter(tags=["events"])

@router.post("/", response_model=schema.Event)
def create_event(event: schema.EventCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_event = models.Event(**event.dict(), user_id=user.id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=list[schema.Event])
def read_user_events(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.Event).filter(models.Event.user_id == user.id).all()

@router.put("/{event_id}", response_model=schema.Event)
def update_event(event_id: int, event: schema.EventCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id, models.Event.user_id == user.id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in event.dict().items():
        setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id, models.Event.user_id == user.id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return {"detail": "Deleted"}
