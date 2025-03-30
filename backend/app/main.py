from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import init_db
from app.auth import router as auth_router 


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

# includes auth route 
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

print("authenticated")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()  # Accept the WebSocket connection
    try:
        while True:
            data = await websocket.receive_text()  # Receive messages from the client
            await websocket.send_text(f"Message received: {data}")  # Send response back
    except WebSocketDisconnect:
        print("Client disconnected")


@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is Running!"}


