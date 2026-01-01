import requests
import sys
import json
from datetime import datetime

class BondRizzAPITester:
    def __init__(self, base_url="https://rizz-connect.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.quiz_result_id = None
        self.order_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_quiz_submission(self):
        """Test quiz submission with sample answers"""
        sample_answers = [
            {"question_id": "q1", "answer": "I overthink every message"},
            {"question_id": "q2", "answer": "Tinder"},
            {"question_id": "q3", "answer": "Daily"},
            {"question_id": "q4", "answer": "Serious relationship"},
            {"question_id": "q5", "answer": "Sometimes"},
            {"question_id": "q6", "answer": "Personalized messages"},
            {"question_id": "q7", "answer": "Confident / Outgoing"},
            {"question_id": "q8", "answer": "25–30"},
            {"question_id": "q9", "answer": 3},
            {"question_id": "q10", "answer": 2},
            {"question_id": "q11", "answer": 4},
            {"question_id": "q12", "answer": "Learn from it"},
            {"question_id": "q13", "answer": "Within 1 hour"},
            {"question_id": "q14", "answer": "2–3"},
            {"question_id": "q15", "answer": "Playful and teasing"},
            {"question_id": "q16", "answer": "India"},
            {"question_id": "q17", "answer": "In a relationship"},
            {"question_id": "q18", "answer": "No but considered it"}
        ]
        
        success, response = self.run_test(
            "Quiz Submission",
            "POST",
            "quiz/submit",
            200,
            data={"answers": sample_answers}
        )
        
        if success and 'id' in response:
            self.quiz_result_id = response['id']
            print(f"   Quiz Result ID: {self.quiz_result_id}")
            print(f"   Score: {response.get('score', 'N/A')}")
            print(f"   Persona: {response.get('persona', 'N/A')}")
        
        return success

    def test_get_quiz_result(self):
        """Test getting quiz result by ID"""
        if not self.quiz_result_id:
            print("❌ Skipping - No quiz result ID available")
            return False
            
        success, response = self.run_test(
            "Get Quiz Result",
            "GET",
            f"quiz/result/{self.quiz_result_id}",
            200
        )
        return success

    def test_email_capture(self):
        """Test email capture functionality"""
        if not self.quiz_result_id:
            print("❌ Skipping - No quiz result ID available")
            return False
            
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        
        success, response = self.run_test(
            "Email Capture",
            "POST",
            "email/capture",
            200,
            data={
                "email": test_email,
                "quiz_result_id": self.quiz_result_id
            }
        )
        return success

    def test_order_creation(self):
        """Test order creation"""
        if not self.quiz_result_id:
            print("❌ Skipping - No quiz result ID available")
            return False
            
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        
        success, response = self.run_test(
            "Order Creation",
            "POST",
            "order/create",
            200,
            data={
                "email": test_email,
                "quiz_result_id": self.quiz_result_id,
                "plan": "Popular",
                "amount": 1799,
                "has_order_bump": True
            }
        )
        
        if success and 'id' in response:
            self.order_id = response['id']
            print(f"   Order ID: {self.order_id}")
        
        return success

    def test_order_completion(self):
        """Test order completion (mock payment)"""
        if not self.order_id:
            print("❌ Skipping - No order ID available")
            return False
            
        success, response = self.run_test(
            "Order Completion (Mock Payment)",
            "POST",
            f"order/complete/{self.order_id}",
            200
        )
        return success

    def test_invalid_endpoints(self):
        """Test error handling for invalid endpoints"""
        print("\n🔍 Testing Error Handling...")
        
        # Test invalid quiz result ID
        success, _ = self.run_test(
            "Invalid Quiz Result ID",
            "GET",
            "quiz/result/invalid-id",
            404
        )
        
        # Test invalid order completion
        success2, _ = self.run_test(
            "Invalid Order Completion",
            "POST",
            "order/complete/invalid-id",
            404
        )
        
        return success and success2

def main():
    print("🚀 Starting Bond Rizz API Testing...")
    print("=" * 50)
    
    tester = BondRizzAPITester()
    
    # Test sequence
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Quiz Submission", tester.test_quiz_submission),
        ("Get Quiz Result", tester.test_get_quiz_result),
        ("Email Capture", tester.test_email_capture),
        ("Order Creation", tester.test_order_creation),
        ("Order Completion", tester.test_order_completion),
        ("Error Handling", tester.test_invalid_endpoints)
    ]
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print final results
    print(f"\n{'='*50}")
    print(f"📊 FINAL RESULTS")
    print(f"{'='*50}")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())