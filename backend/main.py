from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import init_db
from app.auth import router as auth_router
from app.group import router as group_router

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
app.include_router(group_router, prefix="/group", tags=["Groups"])

print("Server started successfully!")

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


