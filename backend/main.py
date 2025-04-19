from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import init_db
from app.auth import router as auth_router
#ZOOM
from dotenv import load_dotenv
import os
import httpx


# executes creating the inital part of the database before fast application starts  
@asynccontextmanager
async def lifespan(app:FastAPI): 
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

  
    
# CORS Middleware (Allows React to communicate with FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# includes auth route wehen routing 
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

print("authenticated")

# will be utilized to send notifications between server and user 
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()  # accept the WebSocket connection
    try:
        while True:
            data = await websocket.receive_text()  # receive messages from the client
            await websocket.send_text(f"Message received: {data}")  # send response back
    except WebSocketDisconnect:
        print("Client disconnected")

# checks if FASTAPI is working 
@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is Running!"}





# ZOOM MEETING CREATION
load_dotenv()
ZOOM_ACCOUNT_ID = os.getenv("ZOOM_ACCOUNT_ID")
ZOOM_CLIENT_ID = os.getenv("ZOOM_CLIENT_ID")
ZOOM_CLIENT_SECRET = os.getenv("ZOOM_CLIENT_SECRET")

@asynccontextmanager
async def lifespan(app: FastAPI): 
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")

@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is Running!"}

@app.post("/create-zoom-meeting")
async def create_meeting():
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://zoom.us/oauth/token",
            params={
                "grant_type": "account_credentials",
                "account_id": ZOOM_ACCOUNT_ID,
            },
            auth=(ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET),
        )

        if token_res.status_code != 200:
            return {"error": "Failed to get access token", "details": token_res.text}

        access_token = token_res.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    meeting_data = {
        "topic": "Planora Video Call",
        "type": 1,
        "settings": {
            "join_before_host": True,
            "approval_type": 0,
            "meeting_authentication": False,
        },
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.zoom.us/v2/users/me/meetings",
            json=meeting_data,
            headers=headers,
        )

        if res.status_code != 201:
            return {"error": "Zoom meeting creation failed", "details": res.text}

        return res.json()