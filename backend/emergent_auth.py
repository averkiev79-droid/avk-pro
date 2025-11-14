"""
Emergent Auth Integration for Google OAuth
"""
import httpx
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import HTTPException, status

class EmergentAuth:
    """Handle Emergent Auth OAuth flow"""
    
    SESSION_DATA_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
    
    @staticmethod
    async def get_session_data(session_id: str) -> dict:
        """
        Exchange session_id for session_token and user data
        
        Args:
            session_id: Temporary token from URL fragment
            
        Returns:
            dict with: id, email, name, picture, session_token
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    EmergentAuth.SESSION_DATA_URL,
                    headers={"X-Session-ID": session_id}
                )
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid session ID"
                    )
                
                return response.json()
                
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Failed to connect to auth service: {str(e)}"
            )
    
    @staticmethod
    def calculate_session_expiry() -> datetime:
        """Calculate session expiration (7 days from now)"""
        return datetime.now(timezone.utc) + timedelta(days=7)
