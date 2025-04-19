# zoom_utils.py
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

ZOOM_ACCOUNT_ID = os.getenv("ZOOM_ACCOUNT_ID")
ZOOM_CLIENT_ID = os.getenv("ZOOM_CLIENT_ID")
ZOOM_CLIENT_SECRET = os.getenv("ZOOM_CLIENT_SECRET")

async def get_zoom_access_token():
    url = f"https://zoom.us/oauth/token?grant_type=account_credentials&account_id={ZOOM_ACCOUNT_ID}"
    headers = {
        "Authorization": f"Basic {httpx.BasicAuth(ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET).auth_header}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers)
        response.raise_for_status()
        return response.json()["access_token"]

async def create_zoom_meeting():
    token = await get_zoom_access_token()

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    body = {
        "topic": "Planora Chat Meeting",
        "type": 1  # Instant meeting
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.zoom.us/v2/users/me/meetings", json=body, headers=headers
        )
        response.raise_for_status()
        return response.json()
