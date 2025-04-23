from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import init_db
from app.auth import router as auth_router
#ZOOM
from dotenv import load_dotenv
import os
import httpx

from app.group import router as group_router
from app.upload import router as upload_router
from app.group import createGroup 
#from connection_manager import manager

from app.task import router as task_router
from app.calendar import router as calendar_router
from app.shareddocs import router as shareddocs_router

# executes creating the inital part of the database before fast application starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

# CORS Middleware (Allows React to communicate with FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(group_router, prefix="/group", tags=["Groups"])
app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(task_router, prefix="/task", tags=["Task"])
app.include_router(calendar_router, prefix="/events", tags=["Events"])
app.include_router(shareddocs_router)

print("Server started successfully!")

# will be utilized to send notifications between server and user
#@app.websocket("/ws")
# will be utilized to send notifications between server and user 


# --- WebSocket endpoint ---
@app.websocket("/ws/groups")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is Running!"}
