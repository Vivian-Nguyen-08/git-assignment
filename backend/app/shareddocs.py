from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import SharedDoc
from app.schema import SharedDocCreate, SharedDocResponse
from app.db import get_session as get_db

router = APIRouter(prefix="/shared-docs", tags=["Shared Docs"])

@router.post("/", response_model=SharedDocResponse)
def create_shared_doc(doc: SharedDocCreate, db: Session = Depends(get_db)):
    db_doc = SharedDoc(**doc.dict())
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.get("/{event_name}", response_model=list[SharedDocResponse])
def get_docs_for_event(event_name: str, db: Session = Depends(get_db)):
    return db.exec(select(SharedDoc).where(SharedDoc.event_name == event_name)).all()

@router.delete("/{doc_id}")
def delete_shared_doc(doc_id: int, db: Session = Depends(get_db)):
    doc = db.get(SharedDoc, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

