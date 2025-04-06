# Pseudocode - Sarah Park

# Module for handling starting a video call using WebRTC and FastAPI
# Based on Use Case: User Initiates Video Call
# Import necessary libraries (FastAPI, WebRTC libraries, WebSocket)
# (Pseudocode - not real imports)
# FastAPI app instance setup

def on_video_call_button_click(user_id):
    """
    When a user clicks the video call button:
    1. Send a call request to backend
    2. Backend initializes a WebRTC session
    3. Notify other users to join via WebSocket
    """
    # Receive video call request from frontend
    # Setup WebRTC session (pseudocode for signaling server setup)
    # Prepare invitation to send to other users

def notify_other_users(websocket_connection, call_invite):
    """
    Send invitation to other users through WebSocket.
    """
    # Loop through connected users
    # Send call invitation

def on_user_accept_call(websocket_connection, call_session_id):
    """
    If user accepts the call:
    1. Connect them to WebRTC session
    2. Establish video/audio stream
    """
    # User accepts the invite
    # Join the WebRTC call session
    # Stream video/audio between participants
