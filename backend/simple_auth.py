"""Simple password-based admin authentication"""
import os
import logging
from typing import Optional, Dict, Any
import secrets

logger = logging.getLogger(__name__)


class SimpleAuth:
    """Simple authentication service for admin access"""
    
    @staticmethod
    def verify_admin_password(password: str) -> bool:
        """
        Verify admin password against environment variable
        
        Args:
            password: Password to verify
            
        Returns:
            True if password matches, False otherwise
        """
        admin_password = os.environ.get("ADMIN_PASSWORD")
        
        if not admin_password:
            logger.error("ADMIN_PASSWORD not configured in environment")
            return False
        
        return password == admin_password
    
    @staticmethod
    def create_admin_session() -> Dict[str, Any]:
        """
        Create a simple admin session
        
        Returns:
            Dictionary with session token and admin info
        """
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@avk-pro.ru")
        
        # Generate a simple session token (32 bytes = 64 hex chars)
        session_token = secrets.token_hex(32)
        
        return {
            "session_token": session_token,
            "email": admin_email,
            "role": "admin"
        }
    
    @staticmethod
    def get_admin_email() -> str:
        """
        Get admin email from environment
        
        Returns:
            Admin email address
        """
        return os.environ.get("ADMIN_EMAIL", "admin@avk-pro.ru")
