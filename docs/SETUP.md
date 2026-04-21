# Project Setup Guide

## Installation

### Backend Setup
```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:
```
DATABASE_URL=sqlite:///./db.sqlite3
SECRET_KEY=your-secret-key-here
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=your-whatsapp-number
```

## Running Tests

```bash
# ML Model tests
python -m pytest test_ml_model.py

# API tests
python -m pytest test_api.py
```

## Database

Initialize the database with:
```bash
python manage.py migrate
```
