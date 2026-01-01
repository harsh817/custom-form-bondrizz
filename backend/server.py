from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class QuizAnswer(BaseModel):
    question_id: str
    answer: Any

class QuizSubmission(BaseModel):
    answers: List[QuizAnswer]

class QuizResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    score: int
    persona: str
    persona_description: str
    headline: str
    strengths: List[str]
    weaknesses: List[str]
    problem_description: str
    answers: List[Dict[str, Any]]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmailCapture(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    quiz_result_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmailCaptureRequest(BaseModel):
    email: EmailStr
    quiz_result_id: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    plan: str
    amount: int
    has_order_bump: bool
    status: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    email: EmailStr
    quiz_result_id: str
    plan: str
    amount: int
    has_order_bump: bool = False

class EmailRequest(BaseModel):
    recipient_email: EmailStr
    subject: str
    html_content: str

# ============ SCORING ALGORITHM ============

def calculate_quiz_results(answers: List[QuizAnswer]) -> Dict[str, Any]:
    """
    Calculate Rizz Score and Persona based on quiz answers
    
    Scoring dimensions:
    - Confidence (0-30 points): Q9, Q10, Q11
    - Engagement Quality (0-25 points): Q1, Q6, Q13
    - Self-Awareness (0-20 points): Q5, Q12
    - Social Intelligence (0-25 points): Q4, Q15
    
    Personas:
    - The Boring Texter (0-40): Low engagement, generic messages
    - The Anxious Overthinker (41-65): High hesitation, self-doubt
    - The Low-Value Matcher (66-85): Poor conversion, lacks confidence
    """
    
    answer_map = {ans.question_id: ans.answer for ans in answers}
    score = 0
    
    # Confidence Score (Q9, Q10, Q11 - Likert scales 1-5)
    confidence_q9 = int(answer_map.get('q9', 1))
    confidence_q10 = int(answer_map.get('q10', 1))
    confidence_q11 = int(answer_map.get('q11', 1))
    confidence_score = (confidence_q9 + confidence_q10 + confidence_q11) * 2  # Max 30
    score += confidence_score
    
    # Engagement Quality
    q1_answer = answer_map.get('q1', '')
    if 'boring' in q1_answer or 'don\'t lead' in q1_answer:
        score += 3
    elif 'overthink' in q1_answer:
        score += 8
    elif 'rarely get replies' in q1_answer:
        score += 5
    else:
        score += 10
    
    q6_answer = answer_map.get('q6', '')
    if 'Personalized' in q6_answer:
        score += 10
    elif 'Copy-paste' in q6_answer:
        score += 2
    elif 'Wait' in q6_answer:
        score += 4
    else:
        score += 6
    
    q13_answer = answer_map.get('q13', '')
    if 'Within 5 minutes' in q13_answer:
        score += 5
    elif 'Within 1 hour' in q13_answer:
        score += 8
    elif 'Few hours' in q13_answer:
        score += 6
    else:
        score += 3
    
    # Self-Awareness
    q5_answer = answer_map.get('q5', '')
    if 'Never' in q5_answer:
        score += 10
    elif 'Rarely' in q5_answer:
        score += 7
    else:
        score += 3
    
    q12_answer = answer_map.get('q12', '')
    if 'Learn from it' in q12_answer:
        score += 10
    elif 'Don\'t care much' in q12_answer:
        score += 6
    elif 'Avoid' in q12_answer:
        score += 3
    else:
        score += 5
    
    # Social Intelligence
    q4_answer = answer_map.get('q4', '')
    if 'Serious relationship' in q4_answer:
        score += 10
    elif 'Casual' in q4_answer:
        score += 8
    else:
        score += 5
    
    q15_answer = answer_map.get('q15', '')
    if 'Playful and teasing' in q15_answer:
        score += 10
    elif 'Direct and clear' in q15_answer:
        score += 8
    elif 'Deep conversations' in q15_answer:
        score += 6
    else:
        score += 5
    
    # Determine Persona
    if score <= 40:
        persona = "boring_texter"
        persona_name = "The Boring Texter"
        persona_description = "Your messages are forgettable and lack personality"
        headline = "Your Matches Ghost You Because Your Messages Are Forgettable"
        strengths = [
            "You're consistent in reaching out",
            "You show interest by messaging first",
            "You're active on dating apps"
        ]
        weaknesses = [
            "Your opening lines are generic and uninspired",
            "You fail to stand out from the 100+ other guys messaging her",
            "Your conversation lacks depth and intrigue",
            "You don't know how to create emotional connection through text",
            "Your messages don't trigger curiosity or anticipation"
        ]
        problem_description = "Here's the harsh truth: Your matches ghost you because your texts are boring. You're using the same copy-paste openers as every other guy. You're not creating any emotional spark. You're just... there. And in the world of dating apps, being forgettable is the kiss of death. Your messages blend into the sea of 'Hey' and 'How was your day?' You need to learn how to be interesting, intriguing, and impossible to ignore."
    
    elif score <= 65:
        persona = "anxious_overthinker"
        persona_name = "The Anxious Overthinker"
        persona_description = "Your overthinking is killing your chances before they start"
        headline = "Your Overthinking Is Killing Your Chances Before They Even Start"
        strengths = [
            "You're thoughtful and care about making a good impression",
            "You pay attention to details",
            "You're self-aware about your communication"
        ]
        weaknesses = [
            "You spend 20 minutes crafting a single message",
            "You second-guess every word before hitting send",
            "Your hesitation comes across as lack of confidence",
            "You wait too long to respond, killing the momentum",
            "Your fear of rejection paralyzes you from taking action"
        ]
        problem_description = "You're your own worst enemy. Every message becomes an anxiety-inducing puzzle. Should you use an emoji? Is that too eager? Is this too much? Not enough? By the time you hit send, the moment has passed. Your matches sense your uncertainty, and uncertainty is the opposite of attractive. You need to break free from analysis paralysis and learn to be spontaneous, confident, and present."
    
    else:
        persona = "low_value_matcher"
        persona_name = "The Low-Value Matcher"
        persona_description = "You're signaling low value in every message you send"
        headline = "You're Signaling Low Value in Every Message You Send"
        strengths = [
            "You get matches and initiate conversations",
            "You're persistent in your dating efforts",
            "You're willing to put yourself out there"
        ]
        weaknesses = [
            "You come across as too available and eager",
            "You don't create enough mystery or challenge",
            "Your messages lack the push-pull dynamic that creates attraction",
            "You reveal too much interest too soon",
            "You don't understand the psychology of desire and pursuit"
        ]
        problem_description = "You're doing everything wrong without realizing it. Replying instantly. Being too available. Showing all your cards. You think being nice and responsive will win her over, but it's having the opposite effect. You're signaling that you have nothing better to do, no other options, and that she's your only focus. That's not attractive—it's desperate. You need to learn how to create scarcity, maintain mystery, and make her work for your attention."
    
    return {
        "score": score,
        "persona": persona,
        "persona_name": persona_name,
        "persona_description": persona_description,
        "headline": headline,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "problem_description": problem_description
    }

# ============ API ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Bond Rizz API"}

@api_router.post("/quiz/submit", response_model=QuizResult)
async def submit_quiz(submission: QuizSubmission):
    """Submit quiz and get personalized results"""
    try:
        results = calculate_quiz_results(submission.answers)
        
        quiz_result = QuizResult(
            score=results["score"],
            persona=results["persona"],
            persona_description=results["persona_description"],
            headline=results["headline"],
            strengths=results["strengths"],
            weaknesses=results["weaknesses"],
            problem_description=results["problem_description"],
            answers=[ans.model_dump() for ans in submission.answers]
        )
        
        # Save to database
        doc = quiz_result.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.quiz_results.insert_one(doc)
        
        logger.info(f"Quiz submitted: {quiz_result.id}, Score: {quiz_result.score}, Persona: {quiz_result.persona}")
        
        return quiz_result
    except Exception as e:
        logger.error(f"Error submitting quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing quiz: {str(e)}")

@api_router.post("/email/capture")
async def capture_email(request: EmailCaptureRequest):
    """Capture email and send results"""
    try:
        # Get quiz result
        quiz_result = await db.quiz_results.find_one({"id": request.quiz_result_id}, {"_id": 0})
        if not quiz_result:
            raise HTTPException(status_code=404, detail="Quiz result not found")
        
        # Save email capture
        email_capture = EmailCapture(
            email=request.email,
            quiz_result_id=request.quiz_result_id
        )
        doc = email_capture.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.email_captures.insert_one(doc)
        
        # Send email with results
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F11; color: white; padding: 40px 20px;">
            <h1 style="color: #8B5CF6; text-align: center;">Your Bond Rizz Results Are Ready!</h1>
            <div style="background: #18181B; padding: 30px; border-radius: 16px; margin: 20px 0;">
                <h2 style="color: #D946EF;">Rizz Score: {quiz_result['score']}/100</h2>
                <h3 style="color: #10B981; margin-top: 20px;">{quiz_result['persona_description']}</h3>
                <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                    {quiz_result['headline']}
                </p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/results?id={request.quiz_result_id}" 
                   style="background: linear-gradient(90deg, #8B5CF6 0%, #D946EF 100%); 
                          color: white; padding: 16px 40px; text-decoration: none; 
                          border-radius: 9999px; font-weight: bold; display: inline-block;">
                    View Full Results
                </a>
            </div>
        </div>
        """
        
        if resend.api_key:
            params = {
                "from": SENDER_EMAIL,
                "to": [request.email],
                "subject": f"Your Rizz Score: {quiz_result['score']}/100 - {quiz_result['persona_description']}",
                "html": html_content
            }
            
            try:
                email_result = await asyncio.to_thread(resend.Emails.send, params)
                logger.info(f"Email sent to {request.email}: {email_result}")
            except Exception as email_error:
                logger.warning(f"Email sending failed: {str(email_error)}")
        
        return {
            "status": "success",
            "message": "Email captured and results sent",
            "quiz_result_id": request.quiz_result_id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error capturing email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error capturing email: {str(e)}")

@api_router.get("/quiz/result/{result_id}")
async def get_quiz_result(result_id: str):
    """Get quiz result by ID"""
    result = await db.quiz_results.find_one({"id": result_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    return result

@api_router.post("/order/create", response_model=Order)
async def create_order(order_create: OrderCreate):
    """Create order (mock payment for now)"""
    try:
        order = Order(
            email=order_create.email,
            plan=order_create.plan,
            amount=order_create.amount,
            has_order_bump=order_create.has_order_bump,
            status="pending"
        )
        
        doc = order.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.orders.insert_one(doc)
        
        logger.info(f"Order created: {order.id}, Plan: {order.plan}, Amount: {order.amount}")
        
        return order
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")

@api_router.post("/order/complete/{order_id}")
async def complete_order(order_id: str):
    """Complete order (mock payment success)"""
    try:
        result = await db.orders.update_one(
            {"id": order_id},
            {"$set": {"status": "completed"}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order = await db.orders.find_one({"id": order_id}, {"_id": 0})
        
        logger.info(f"Order completed: {order_id}")
        
        return {"status": "success", "message": "Order completed", "order": order}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error completing order: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
