# Team Task Manager

A full-stack MERN (MongoDB, Express, React, Node.js) web application with role-based access control.

## Requirements
- Node.js installed
- MongoDB installed and running locally, or a MongoDB Atlas URI

## Setup & Running Locally

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your MongoDB is running locally on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in `backend/.env` to point to your cluster.
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will start running on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will usually be accessible at `http://localhost:5173`.

## Test Accounts
You can create a new user from the Register page. Choose "Admin" to access admin features like creating projects and adding tasks, or "Member" to just see and update assigned tasks.

## Tech Stack
- **Frontend**: React (Vite), Custom CSS, Lucide React (icons), React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
