from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
import requests
import pika
import json
import logging
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
from sqlalchemy.orm import Session
from models import Booking  # Import Booking from models
from database import engine, Base, get_db

app = FastAPI()

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# RabbitMQ Configuration
RABBITMQ_HOST = "localhost"
RABBITMQ_QUEUE = "booking_notifications"

# Booking Model (Pydantic)
class BookingCreate(BaseModel):
    user_id: str = Field(..., example="user123")
    event_id: str = Field(..., example="event456")
    tickets: int = Field(..., gt=0, example=2)  # Must be > 0
    status: Optional[str] = "PENDING"  # Now optional

# Mock Payment Gateway
def process_payment(user_id: str, amount: float) -> bool:
    return True  # Simulated successful payment

# Publish Notification to RabbitMQ
def publish_notification(booking_id: str, user_email: str, status: str):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)  # Ensure durability matches
        message = json.dumps({
            "recipient": user_email,  # Use "recipient" instead of "user_email"
            "subject": "Booking Confirmation",  # Add subject
            "message": f"Your booking (ID: {booking_id}) has been {status}."  # Add message
        })
        channel.basic_publish(exchange="", routing_key=RABBITMQ_QUEUE, body=message)
        connection.close()
        logger.info("✅ Notification published to RabbitMQ")
    except Exception as e:
        logger.error(f"❌ Failed to publish notification: {e}")

# Create Booking
@app.post("/bookings/")
async def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    try:
        logger.info("📩 Received Booking Request: %s", booking.model_dump())  # Use model_dump()

        # Validate Event Availability
        event_response = requests.get(f"http://localhost:8002/events/{booking.event_id}/availability")
        if event_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Event not found")

        available_tickets = event_response.json().get("available_tickets", 0)
        if booking.tickets > available_tickets:
            raise HTTPException(status_code=400, detail="Not enough tickets available")

        # Process Payment
        if not process_payment(booking.user_id, booking.tickets * 10):  
            raise HTTPException(status_code=400, detail="Payment failed")

        # Update Event Tickets
        update_response = requests.put(
            f"http://localhost:8002/events/{booking.event_id}/update-tickets?tickets_booked={booking.tickets}"
        )
        if update_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to update event tickets")

        # Fetch User Email
        user_response = requests.get(f"http://localhost:8001/users/{booking.user_id}")
        if user_response.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")

        user_email = user_response.json().get("email")
        if not user_email:
            raise HTTPException(status_code=500, detail="User email not found")

        # Assign Booking ID if Not Provided
        booking_id = str(uuid.uuid4())[:10]  # Proper random ID

        # Save Booking to Database
        db_booking = Booking(
            booking_id=booking_id,
            user_id=booking.user_id,
            event_id=booking.event_id,
            tickets=booking.tickets,
            status="CONFIRMED"
        )
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)

        # Publish Notification
        publish_notification(booking_id, user_email, "CONFIRMED")

        return {"message": "✅ Booking confirmed successfully", "booking_id": booking_id}

    except requests.RequestException as req_err:
        logger.error(f"❌ External API error: {req_err}")
        raise HTTPException(status_code=502, detail="Error communicating with external service")

    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

# Get All Bookings
@app.get("/bookings/")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings