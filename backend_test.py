#!/usr/bin/env python3
"""
Backend API Testing Script for Products CRUD endpoints
Tests all Product API endpoints with comprehensive validation
"""

import requests
import json
import uuid
from datetime import datetime
import sys
import io
from PIL import Image

# Backend URL from environment
BACKEND_URL = "https://hockey-shop.preview.emergentagent.com/api"

class ProductAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.created_product_ids = []
        self.test_results = []
        self.uploaded_files = []
        
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
    
    def test_create_product(self):
        """Test POST /api/products - Create new product with multiple images"""
        print("\n=== Testing Product Creation ===")
        
        # Test data with multiple images
        product_data = {
            "name": "Хоккейная форма Профи",
            "category": "jersey",
            "description": "Профессиональная хоккейная форма высокого качества",
            "base_price": 4500.0,
            "images": [
                "https://example.com/jersey1.jpg",
                "https://example.com/jersey2.jpg", 
                "https://example.com/jersey3.jpg"
            ],
            "features": ["Влагоотводящая ткань", "Усиленные швы", "Антибактериальная обработка"],
            "size_categories": ["kids", "teens", "adults"],
            "is_featured": True,
            "is_active": True
        }
        
        try:
            response = requests.post(f"{self.base_url}/products", json=product_data, timeout=10)
            
            if response.status_code == 201:
                result = response.json()
                if result.get("success") and result.get("id"):
                    product_id = result["id"]
                    self.created_product_ids.append(product_id)
                    self.log_result(
                        "Create Product", 
                        True, 
                        f"Product created successfully with ID: {product_id}",
                        {"product_id": product_id, "response": result}
                    )
                    return product_id
                else:
                    self.log_result("Create Product", False, "Invalid response format", {"response": result})
            else:
                self.log_result("Create Product", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Create Product", False, f"Request failed: {str(e)}")
            
        return None
    
    def test_get_all_products(self):
        """Test GET /api/products - Get all products"""
        print("\n=== Testing Get All Products ===")
        
        try:
            response = requests.get(f"{self.base_url}/products", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list):
                    self.log_result(
                        "Get All Products", 
                        True, 
                        f"Retrieved {len(products)} products",
                        {"count": len(products)}
                    )
                    return products
                else:
                    self.log_result("Get All Products", False, "Response is not a list", {"response": products})
            else:
                self.log_result("Get All Products", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Get All Products", False, f"Request failed: {str(e)}")
            
        return []
    
    def test_get_products_with_filters(self):
        """Test GET /api/products with filters"""
        print("\n=== Testing Get Products with Filters ===")
        
        # Test filter by is_active=true
        try:
            response = requests.get(f"{self.base_url}/products?is_active=true", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                active_products = [p for p in products if p.get("is_active", False)]
                if len(active_products) == len(products):
                    self.log_result(
                        "Filter by is_active=true", 
                        True, 
                        f"All {len(products)} products are active",
                        {"active_count": len(active_products)}
                    )
                else:
                    self.log_result(
                        "Filter by is_active=true", 
                        False, 
                        f"Filter not working: {len(active_products)}/{len(products)} active"
                    )
            else:
                self.log_result("Filter by is_active=true", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Filter by is_active=true", False, f"Request failed: {str(e)}")
        
        # Test filter by category
        try:
            response = requests.get(f"{self.base_url}/products?category=jersey", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                jersey_products = [p for p in products if p.get("category") == "jersey"]
                if len(jersey_products) == len(products):
                    self.log_result(
                        "Filter by category=jersey", 
                        True, 
                        f"All {len(products)} products are jerseys",
                        {"jersey_count": len(jersey_products)}
                    )
                else:
                    self.log_result(
                        "Filter by category=jersey", 
                        False, 
                        f"Filter not working: {len(jersey_products)}/{len(products)} jerseys"
                    )
            else:
                self.log_result("Filter by category=jersey", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Filter by category=jersey", False, f"Request failed: {str(e)}")
    
    def test_get_single_product(self, product_id):
        """Test GET /api/products/{product_id} - Get single product"""
        print(f"\n=== Testing Get Single Product (ID: {product_id}) ===")
        
        if not product_id:
            self.log_result("Get Single Product", False, "No product ID provided")
            return None
            
        try:
            response = requests.get(f"{self.base_url}/products/{product_id}", timeout=10)
            
            if response.status_code == 200:
                product = response.json()
                
                # Validate product structure
                required_fields = ["id", "name", "category", "description", "base_price", "images", "is_active"]
                missing_fields = [field for field in required_fields if field not in product]
                
                if not missing_fields:
                    # Validate images array
                    images = product.get("images", [])
                    if isinstance(images, list) and len(images) > 0:
                        self.log_result(
                            "Get Single Product", 
                            True, 
                            f"Product retrieved with {len(images)} images",
                            {
                                "product_id": product["id"],
                                "name": product["name"],
                                "images_count": len(images),
                                "category": product["category"]
                            }
                        )
                        return product
                    else:
                        self.log_result("Get Single Product", False, "Images field is not a valid array", {"images": images})
                else:
                    self.log_result("Get Single Product", False, f"Missing required fields: {missing_fields}")
            elif response.status_code == 404:
                self.log_result("Get Single Product", False, "Product not found (404)")
            else:
                self.log_result("Get Single Product", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Get Single Product", False, f"Request failed: {str(e)}")
            
        return None
    
    def test_update_product(self, product_id):
        """Test PUT /api/products/{product_id} - Update product"""
        print(f"\n=== Testing Update Product (ID: {product_id}) ===")
        
        if not product_id:
            self.log_result("Update Product", False, "No product ID provided")
            return False
            
        # Update data with new images array
        update_data = {
            "name": "Хоккейная форма Профи (Обновлено)",
            "base_price": 5000.0,
            "images": [
                "https://example.com/jersey1_updated.jpg",
                "https://example.com/jersey2_updated.jpg",
                "https://example.com/jersey3_updated.jpg",
                "https://example.com/jersey4_new.jpg"
            ],
            "features": ["Влагоотводящая ткань", "Усиленные швы", "Антибактериальная обработка", "Новая технология"],
            "is_featured": False
        }
        
        try:
            response = requests.put(f"{self.base_url}/products/{product_id}", json=update_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_result(
                        "Update Product", 
                        True, 
                        "Product updated successfully",
                        {"product_id": product_id, "response": result}
                    )
                    
                    # Verify the update by fetching the product
                    updated_product = self.test_get_single_product(product_id)
                    if updated_product:
                        if (updated_product.get("name") == update_data["name"] and 
                            updated_product.get("base_price") == update_data["base_price"] and
                            len(updated_product.get("images", [])) == 4):
                            self.log_result(
                                "Verify Update", 
                                True, 
                                "Update verification successful",
                                {"updated_fields": ["name", "base_price", "images"]}
                            )
                            return True
                        else:
                            self.log_result("Verify Update", False, "Updated data doesn't match")
                else:
                    self.log_result("Update Product", False, "Update response indicates failure", {"response": result})
            else:
                self.log_result("Update Product", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Update Product", False, f"Request failed: {str(e)}")
            
        return False
    
    def test_delete_product(self, product_id):
        """Test DELETE /api/products/{product_id} - Delete product"""
        print(f"\n=== Testing Delete Product (ID: {product_id}) ===")
        
        if not product_id:
            self.log_result("Delete Product", False, "No product ID provided")
            return False
            
        try:
            response = requests.delete(f"{self.base_url}/products/{product_id}", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_result(
                        "Delete Product", 
                        True, 
                        "Product deleted successfully",
                        {"product_id": product_id}
                    )
                    
                    # Verify deletion by trying to fetch the product
                    verify_response = requests.get(f"{self.base_url}/products/{product_id}", timeout=10)
                    if verify_response.status_code == 404:
                        self.log_result(
                            "Verify Deletion", 
                            True, 
                            "Product successfully removed from database"
                        )
                        return True
                    else:
                        self.log_result("Verify Deletion", False, "Product still exists after deletion")
                else:
                    self.log_result("Delete Product", False, "Delete response indicates failure", {"response": result})
            else:
                self.log_result("Delete Product", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Delete Product", False, f"Request failed: {str(e)}")
            
        return False
    
    def test_datetime_serialization(self):
        """Test that datetime fields are properly serialized"""
        print("\n=== Testing Datetime Serialization ===")
        
        products = self.test_get_all_products()
        if products:
            for product in products[:1]:  # Test first product
                created_at = product.get("created_at")
                updated_at = product.get("updated_at")
                
                if created_at and updated_at:
                    try:
                        # Try to parse as ISO format
                        datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                        self.log_result(
                            "Datetime Serialization", 
                            True, 
                            "Datetime fields are properly serialized",
                            {"created_at": created_at, "updated_at": updated_at}
                        )
                        return True
                    except ValueError as e:
                        self.log_result("Datetime Serialization", False, f"Invalid datetime format: {str(e)}")
                else:
                    self.log_result("Datetime Serialization", False, "Missing datetime fields")
        else:
            self.log_result("Datetime Serialization", False, "No products available for testing")
            
        return False
    
    def test_file_upload(self):
        """Test POST /api/upload - File upload endpoint"""
        print("\n=== Testing File Upload Endpoint ===")
        
        try:
            # Create a test image in memory
            img = Image.new('RGB', (100, 100), color='red')
            img_buffer = io.BytesIO()
            img.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # Prepare file for upload
            files = {
                'file': ('test_image.png', img_buffer, 'image/png')
            }
            
            # Upload the file
            response = requests.post(f"{self.base_url}/upload", files=files, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if response has required fields
                if 'url' in result and 'filename' in result:
                    file_url = result['url']
                    filename = result['filename']
                    
                    # Store for cleanup
                    self.uploaded_files.append(filename)
                    
                    self.log_result(
                        "File Upload", 
                        True, 
                        f"File uploaded successfully: {filename}",
                        {"url": file_url, "filename": filename}
                    )
                    
                    # Test file accessibility
                    return self.test_file_accessibility(file_url, filename)
                else:
                    self.log_result("File Upload", False, "Invalid response format", {"response": result})
            else:
                self.log_result("File Upload", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("File Upload", False, f"Request failed: {str(e)}")
            
        return False
    
    def test_file_accessibility(self, file_url, filename):
        """Test that uploaded file is accessible via the returned URL"""
        print(f"\n=== Testing File Accessibility ({filename}) ===")
        
        try:
            # Construct full URL - the file_url should be relative like /api/uploads/filename
            if file_url.startswith('/api/uploads/'):
                full_url = f"{self.base_url.replace('/api', '')}{file_url}"
            else:
                full_url = f"{self.base_url}/{file_url}"
            
            response = requests.get(full_url, timeout=10)
            
            if response.status_code == 200:
                # Check if it's actually an image
                content_type = response.headers.get('content-type', '')
                if content_type.startswith('image/'):
                    self.log_result(
                        "File Accessibility", 
                        True, 
                        f"File accessible with correct content-type: {content_type}",
                        {"url": full_url, "content_type": content_type, "size": len(response.content)}
                    )
                    return True
                else:
                    self.log_result("File Accessibility", False, f"Wrong content-type: {content_type}")
            elif response.status_code == 404:
                self.log_result("File Accessibility", False, "File not found (404)")
            else:
                self.log_result("File Accessibility", False, f"HTTP {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("File Accessibility", False, f"Request failed: {str(e)}")
            
        return False
    
    def run_all_tests(self):
        """Run all product API tests"""
        print(f"🚀 Starting Product API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Create product
        product_id = self.test_create_product()
        
        # Test 2: Get all products
        self.test_get_all_products()
        
        # Test 3: Get products with filters
        self.test_get_products_with_filters()
        
        # Test 4: Get single product
        if product_id:
            self.test_get_single_product(product_id)
            
            # Test 5: Update product
            self.test_update_product(product_id)
            
            # Test 6: Delete product
            self.test_delete_product(product_id)
        
        # Test 7: Datetime serialization
        self.test_datetime_serialization()
        
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
    tester = ProductAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)