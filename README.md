# BookingSystem

BookingSystem is a microservices-based event booking application with a Next.js frontend and FastAPI backend services.

## Overview

The application supports:
- User registration and login with JWT-based authentication
- Event creation and ticket availability tracking
- Booking creation with event availability checks
- Notification processing through RabbitMQ and email delivery
- A dashboard UI for users, events, bookings, and notifications

## Architecture

### Frontend
- **Framework:** Next.js (App Router, TypeScript)
- **Path:** `/frontend`
- **Default URL:** `http://localhost:3000`

### Backend Services
- **User Service** (`/services/user_service`, port `8001`)  
  Manages user registration, login, and profile lookup.
- **Event Service** (`/services/event_service`, port `8002`)  
  Manages events and ticket availability.
- **Booking Service** (`/services/booking_service`, port `8003`)  
  Creates bookings, validates event capacity, and triggers notifications.
- **Notification Service** (`/services/notification_service`, port `8004`)  
  Consumes RabbitMQ messages, stores notifications, and sends emails.

### Data & Messaging
- PostgreSQL for User Service (`5433`)
- PostgreSQL for Booking Service (`5434`)
- MongoDB for Notification Service (`27018`)
- MongoDB for Event Service (`27019`)
- RabbitMQ (`5672`) and management UI (`15672`)

Infrastructure is defined in: `/database/docker-compose.yml`

## Repository Structure

```text
BookingSystem/
├── database/
│   └── docker-compose.yml
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/api/
├── services/
│   ├── user_service/
│   ├── event_service/
│   ├── booking_service/
│   └── notification_service/
└── start_services.bat
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Docker + Docker Compose

## Setup & Run

### 1) Start infrastructure services

From `/database`:

```bash
docker compose up -d
```

### 2) Install Python dependencies

Install dependencies for each backend service:

```bash
cd services/user_service && pip install -r requirements.txt
cd ../event_service && pip install -r requirements.txt
cd ../booking_service && pip install -r requirements.txt
cd ../notification_service && pip install -r requirements.txt
```

### 3) Start backend services

From repository root (separate terminals):

```bash
cd services/user_service && uvicorn main:app --reload --port 8001
cd services/event_service && uvicorn main:app --reload --port 8002
cd services/booking_service && uvicorn main:app --reload --port 8003
cd services/notification_service && uvicorn main:app --reload --port 8004
```

> On Windows, `start_services.bat` can be used as a quick startup helper.

### 4) Start frontend

From `/frontend`:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Service API Summary

### User Service (`http://localhost:8001`)
- `POST /register`
- `POST /login`
- `GET /profile?email=...`
- `GET /users/{user_id}`

### Event Service (`http://localhost:8002`)
- `POST /events/`
- `GET /events/`
- `GET /events/{event_id}/availability`
- `PUT /events/{event_id}/update-tickets/`

### Booking Service (`http://localhost:8003`)
- `POST /bookings/`
- `GET /bookings/`

### Notification Service (`http://localhost:8004`)
- `GET /health/`
- `GET /notifications/`
- `POST /send-notification/`

## Notes

- The project currently uses local service URLs and local database/message broker ports.
- Some service credentials and secrets are currently hardcoded in source files; move them to environment variables before production use.
