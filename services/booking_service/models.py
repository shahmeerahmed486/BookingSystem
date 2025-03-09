from sqlalchemy import Column, Integer, String
from database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String, unique=True, index=True)
    user_id = Column(String, index=True)
    event_id = Column(String, index=True)
    tickets = Column(Integer)
    status = Column(String, default="PENDING")