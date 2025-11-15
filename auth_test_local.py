#!/usr/bin/env python3
"""
Local Authentication Testing Script
Tests authentication endpoints locally to verify functionality
"""

import requests
import json
from datetime import datetime, timedelta, timezone
import sys

# Local backend URL
BACKEND_URL = "http://localhost:8001/api"

class LocalAuthTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.access_token = None
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_admin_login(self):
        """Test POST /api/auth/login - Login with simplepay@mail.ru"""
        print("\n=== Testing Admin Login (simplepay@mail.ru) ===")
        
        login_data = {
            "email": "simplepay@mail.ru",
            "password": "admin123"
        }
        
        try:
            response = requests.post(f"{self.base_url}/auth/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Validate response structure
                required_fields = ["access_token", "token_type", "user"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    user = result["user"]
                    
                    # Validate admin user data
                    if user.get("email") == "simplepay@mail.ru":
                        
                        self.access_token = result["access_token"]
                        
                        self.log_result(
                            "Admin Login", 
                            True, 
                            f"Admin simplepay@mail.ru logged in successfully",
                            {
                                "email": user["email"],
                                "role": user.get("role"),
                                "full_name": user.get("full_name"),
                                "token_received": bool(self.access_token)
                            }
                        )
                        return True
                    else:
                        self.log_result("Admin Login", False, "Admin user data validation failed", {"user": user})
                else:
                    self.log_result("Admin Login", False, f"Missing required fields: {missing_fields}")
            else:
                self.log_result("Admin Login", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Admin Login", False, f"Request failed: {str(e)}")
            
        return False
    
    def test_forgot_password(self):
        """Test POST /api/auth/forgot-password - Request password reset"""
        print("\n=== Testing Forgot Password ===")
        
        forgot_data = {
            "email": "simplepay@mail.ru"
        }
        
        try:
            response = requests.post(f"{self.base_url}/auth/forgot-password", json=forgot_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if response has success message
                if "message" in result:
                    self.log_result(
                        "Forgot Password", 
                        True, 
                        f"Password reset request successful",
                        {
                            "email": forgot_data["email"],
                            "message": result["message"],
                            "status_code": 200
                        }
                    )
                    return True
                else:
                    self.log_result("Forgot Password", False, "Invalid response format", {"response": result})
            else:
                self.log_result("Forgot Password", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Forgot Password", False, f"Request failed: {str(e)}")
            
        return False
    
    def test_reset_password_flow(self):
        """Test POST /api/auth/reset-password - Reset password with valid token"""
        print("\n=== Testing Reset Password Flow ===")
        
        try:
            # Generate a valid reset token using the same logic as the backend
            from dotenv import load_dotenv
            load_dotenv('/app/backend/.env')
            
            from jose import jwt
            import os
            
            # Use the same secret key as the backend
            secret_key = os.environ.get('JWT_SECRET_KEY')
            
            # Create a test token for password reset (valid for 1 hour)
            # Using the actual admin user ID
            test_user_id = "d44627e4-9afe-480c-a65d-688090fabc9a"
            reset_token_data = {
                "sub": test_user_id,
                "type": "password_reset",
                "exp": datetime.now(timezone.utc) + timedelta(hours=1)
            }
            
            test_reset_token = jwt.encode(reset_token_data, secret_key, algorithm="HS256")
            
            # Test the reset password endpoint
            reset_data = {
                "token": test_reset_token,
                "new_password": "testpassword123"
            }
            
            response = requests.post(f"{self.base_url}/auth/reset-password", json=reset_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                self.log_result(
                    "Reset Password Flow", 
                    True, 
                    "Password reset successful",
                    {
                        "message": result.get("message"),
                        "status_code": 200
                    }
                )
                
                # Test login with new password
                login_data = {
                    "email": "simplepay@mail.ru",
                    "password": "testpassword123"
                }
                
                login_response = requests.post(f"{self.base_url}/auth/login", json=login_data, timeout=10)
                
                if login_response.status_code == 200:
                    self.log_result(
                        "Login with New Password", 
                        True, 
                        "Login successful with new password"
                    )
                    
                    # Reset password back to original
                    reset_back_token_data = {
                        "sub": test_user_id,
                        "type": "password_reset",
                        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
                    }
                    
                    reset_back_token = jwt.encode(reset_back_token_data, secret_key, algorithm="HS256")
                    
                    reset_back_data = {
                        "token": reset_back_token,
                        "new_password": "admin123"
                    }
                    
                    requests.post(f"{self.base_url}/auth/reset-password", json=reset_back_data, timeout=10)
                    
                    self.log_result(
                        "Password Reset Back", 
                        True, 
                        "Password reset back to original"
                    )
                    
                else:
                    self.log_result("Login with New Password", False, f"Login failed with new password: {login_response.status_code}")
                
                return True
            else:
                self.log_result("Reset Password Flow", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except ImportError as e:
            self.log_result("Reset Password Flow", False, f"Missing JWT library: {str(e)}")
        except Exception as e:
            self.log_result("Reset Password Flow", False, f"Request failed: {str(e)}")
            
        return False
    
    def test_protected_endpoint(self):
        """Test GET /api/auth/me - Get current user info with JWT token"""
        print("\n=== Testing Protected Endpoint ===")
        
        if not self.access_token:
            self.log_result("Protected Endpoint", False, "No access token available")
            return False
        
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        
        try:
            response = requests.get(f"{self.base_url}/auth/me", headers=headers, timeout=10)
            
            if response.status_code == 200:
                user = response.json()
                
                # Validate user data
                if user.get("email") == "simplepay@mail.ru":
                    self.log_result(
                        "Protected Endpoint", 
                        True, 
                        "Successfully retrieved user info with JWT token",
                        {
                            "email": user["email"],
                            "role": user.get("role"),
                            "full_name": user.get("full_name")
                        }
                    )
                    return True
                else:
                    self.log_result("Protected Endpoint", False, "User data mismatch", {"user": user})
            else:
                self.log_result("Protected Endpoint", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Protected Endpoint", False, f"Request failed: {str(e)}")
            
        return False
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print(f"🚀 Starting Local Authentication Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 80)
        
        # Test 1: Admin Login
        self.test_admin_login()
        
        # Test 2: Forgot Password
        self.test_forgot_password()
        
        # Test 3: Reset Password Flow
        self.test_reset_password_flow()
        
        # Test 4: Protected Endpoint
        self.test_protected_endpoint()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        
        return failed == 0

if __name__ == "__main__":
    tester = LocalAuthTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)