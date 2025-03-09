from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
import requests
import pika
import json
import logging
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid

app = FastAPI()

# ✅ Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ Mocked PostgreSQL-like storage (Replace with real DB later)
BOOKING_DB = []

# ✅ RabbitMQ Configuration
RABBITMQ_HOST = "localhost"
RABBITMQ_QUEUE = "booking_notifications"

# ✅ Booking Model
class Booking(BaseModel):
    booking_id: Optional[str] = Field(None, example="abc123xyz")
    user_id: str = Field(..., example="user123")
    event_id: str = Field(..., example="event456")
    tickets: int = Field(..., gt=0, example=2)  # Must be > 0
    status: str = "PENDING"

# ✅ Mock Payment Gateway
def process_payment(user_id: str, amount: float) -> bool:
    return True  # Simulated successful payment

# ✅ Publish Notification to RabbitMQ
def publish_notification(booking_id: str, user_email: str, status: str):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=RABBITMQ_QUEUE)
        
        message = json.dumps({"booking_id": booking_id, "user_email": user_email, "status": status})
        channel.basic_publish(exchange="", routing_key=RABBITMQ_QUEUE, body=message)
        
        connection.close()
        logger.info("✅ Notification published to RabbitMQ")
    except Exception as e:
        logger.error(f"❌ Failed to publish notification: {e}")

# ✅ Create Booking
@app.post("/bookings/")
async def create_booking(booking: Booking, request: Request):
    try:
        logger.info("Received booking request: %s", await request.json())

        # ✅ Validate Event Availability
        event_response = requests.get(f"http://localhost:8002/events/{booking.event_id}/availability")
        if event_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Event not found")

        available_tickets = event_response.json().get("available_tickets", 0)
        if booking.tickets > available_tickets:
            raise HTTPException(status_code=400, detail="Not enough tickets available")

        # ✅ Process Payment
        if not process_payment(booking.user_id, booking.tickets * 10):  
            raise HTTPException(status_code=400, detail="Payment failed")

        # ✅ Update Event Tickets
        update_response = requests.put(
            f"http://localhost:8002/events/{booking.event_id}/update-tickets?tickets_booked={booking.tickets}"
        )
        if update_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to update event tickets")

        # ✅ Fetch User Email
        user_response = requests.get(f"http://localhost:8001/users/{booking.user_id}")
        if user_response.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")

        user_email = user_response.json().get("email")
        if not user_email:
            raise HTTPException(status_code=500, detail="User email not found")

        # ✅ Assign Booking ID if Not Provided
        if not booking.booking_id:
            booking.booking_id = str(uuid.uuid4())[:10]  # Proper random ID

        # ✅ Save Booking
        booking.status = "CONFIRMED"
        BOOKING_DB.append(booking.dict())  # Corrected from .dict()

        # ✅ Publish Notification
        publish_notification(booking.booking_id, user_email, booking.status)

        return {"message": "✅ Booking confirmed successfully", "booking_id": booking.booking_id}

    except requests.RequestException as req_err:
        logger.error(f"❌ External API error: {req_err}")
        raise HTTPException(status_code=502, detail="Error communicating with external service")

    except Exception as e:
        logger.error(f"❌ Error creating booking: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

# ✅ Get All Bookings
@app.get("/bookings/")
def get_bookings():
    return BOOKING_DB
