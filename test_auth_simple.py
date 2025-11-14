#!/usr/bin/env python3
"""
Simple authentication test
"""
import requests
import json

BACKEND_URL = "https://hockey-shop.preview.emergentagent.com/api"

def test_auth():
    print("Testing authentication flow...")
    
    # 1. Login as admin
    login_data = {
        "email": "admin@avk-sport.ru",
        "password": "admin123"
    }
    
    response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data)
    print(f"Login response: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        token = result["access_token"]
        print(f"Token received: {token[:50]}...")
        
        # 2. Test /auth/me with token
        headers = {"Authorization": f"Bearer {token}"}
        me_response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers)
        print(f"/auth/me response: {me_response.status_code}")
        print(f"Response: {me_response.text}")
        
        # 3. Test without token
        no_token_response = requests.get(f"{BACKEND_URL}/auth/me")
        print(f"/auth/me without token: {no_token_response.status_code}")
        print(f"Response: {no_token_response.text}")
    else:
        print(f"Login failed: {response.text}")

if __name__ == "__main__":
    test_auth()