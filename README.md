# Wedify - Full Stack Project

This project has been converted into a full stack application with a Python backend and a React frontend.

## Project Structure

- **frontend/**: Contains the React application (Vite).
- **backend/**: Contains the Python FastAPI application with SQLite database.

## Getting Started

### Backend Setup (Python)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at the URL shown in the terminal (usually `http://localhost:5173`).

## Connecting Frontend to Backend

The backend is configured with CORS to allow requests from any origin during development. You can fetch data from the backend using:

```javascript
fetch("http://127.0.0.1:8000/")
  .then(response => response.json())
  .then(data => console.log(data));
```

Note: for production, update the CORS settings in `backend/main.py` and environment configurations.
