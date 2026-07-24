# Maker Market

A full-stack web application that allows users to rent equipment from other users.

## Technologies Used
- React
- Node.js
- Express
- MongoDB Atlas
- JWT
- bcrypt
- Google OAuth

## Prerequisites
- Node.js
- npm
- MongoDB Atlas account
- Google OAuth credentials

## Installation

### 1. Clone the repository
In the terminal, run 
```bash
git clone <https://github.com/Andres-55/MakerMarket.git>
```

### 2. Install dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
In another terminal, run
```bash
cd frontend
npm install
```

### 3. Create your .env files

In the backend folder, your .env file should have
```env
MONGODB_URI=<your_mongodb_uri>
DB_NAME=<your_database_name>
JWT_SECRET_KEY=<your_jwt_secret>
```

In your frontend folder, your .env file should have
```env
REACT_APP_GOOGLE_CLIENT_ID=<your_google_client_id>
```

### 4. Run the application

Backend Terminal:
```bash
npm start
```

Frontend Terminal:
```bash
npm start
```

The frontend runs on http://localhost:3000 and the backend runs on http://localhost:3001.
