from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
import io

from app.models import Upload
from app.db import get_session

router = APIRouter()

@router.post('/')
async def upload_file(file: UploadFile, session: Session = Depends(get_session)):
    filename = file.filename
    if not validate_filename(filename):
        raise HTTPException("Filename already exists")
    file_content = await file.read()
    new_upload = Upload(name=filename, data=file_content)


    session.add(new_upload)
    session.commit()

    return "file uploaded!"


async def validate_filename(filename: str, session: Session = Depends(get_session)):
    found_files = session.exec(select(Upload).where(Upload.name == filename))
    if len(found_files) > 0:
        return False
    else:
        return True

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
