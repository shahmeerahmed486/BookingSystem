@echo off
start cmd /k "cd services\user_service && uvicorn main:app --port 8001"
start cmd /k "cd services\event_service && uvicorn main:app --port 8002"
start cmd /k "cd services\booking_service && uvicorn main:app --port 8003"
start cmd /k "cd services\notification_service && uvicorn main:app --port 8004"
start cmd /k "cd frontend && npm run dev"
