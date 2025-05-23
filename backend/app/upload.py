from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Form
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
import io
from typing import List
import mimetypes
from io import BytesIO

from app.models import Upload
from app.db import get_session

router = APIRouter()

# @router.post('/')
# async def upload_file(file: UploadFile, group_id: int, session: Session = Depends(get_session)):
#     filename = file.filename
#     if not validate_filename(filename):
#         raise HTTPException("Filename already exists")
#     file_content = await file.read()
#     new_upload = Upload(name=filename, data=file_content, group_id=group_id)
#     session.add(new_upload)
#     session.commit()

#     return "file uploaded!"


# async def validate_filename(filename: str, session: Session = Depends(get_session)):
#     found_files = session.exec(select(Upload).where(Upload.name == filename))
#     if len(found_files) > 0:
#         return False
#     else:
#         return True
    
@router.post("/")
async def upload_file(file: UploadFile = File(...), group_id: str = Form(...), session: Session = Depends(get_session)):
    filename = file.filename

    if not validate_filename(filename, session):
        raise HTTPException(status_code=400, detail="Filename already exists")

    file_content = await file.read()
    new_upload = Upload(name=filename, data=file_content, group_id=group_id)

    session.add(new_upload)
    session.commit()
    session.refresh(new_upload)

    return {"message": "File uploaded!", "filename": new_upload.name}

def validate_filename(filename: str, session: Session) -> bool:
    found_file = session.exec(select(Upload).where(Upload.name == filename)).first()
    return found_file is None

@router.get("/{filename}")
async def fetch_file(filename: str, session: Session = Depends(get_session)):
    db_result = session.exec(select(Upload).where(Upload.name == filename))
    pulled_file = db_result.first()
    file_stream = io.BytesIO(pulled_file.data)
    return StreamingResponse(
        file_stream,
        headers={
            "Content-Disposition": f"attachment; filename={pulled_file.name}"
        }
    )

# Fetches filenames for groups
@router.get("/group/{group_id}", response_model= List[str])
async def fetch_group_files(group_id: int, session: Session = Depends(get_session)):
    group_filenames = []
    group_files = session.exec(select(Upload).where(Upload.group_id == group_id))
    for g in group_files.all():
       group_filenames.append(g.name)
    return group_filenames



@router.get("/files")
def list_files(session: Session = Depends(get_session)):
    uploads = session.exec(select(Upload)).all()
    return [{"name": u.name} for u in uploads]

from fastapi.responses import StreamingResponse
from io import BytesIO

@router.get("/upload/{filename}")
async def download_file(filename: str, session: Session = Depends(get_session)):
    file_record = session.exec(select(Upload).where(Upload.name == filename)).first()

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    # Determine content type if you want; here we just send octet-stream
    return StreamingResponse(
        BytesIO(file_record.data),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'inline; filename="{file_record.name}"'
        }
    )
