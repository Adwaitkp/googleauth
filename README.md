# Pramyan - Google Auth Assignment

This is a full-stack Google OAuth authentication project with separate backend and frontend apps.

## Tech Stack

- Frontend: Next.js + React + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB (Atlas for deployment)
- Authentication: Google OAuth 2.0 + JWT in HTTP-only cookie

## Project Structure

- `backend` - Express API, Google OAuth, MongoDB user persistence
- `frontend` - Next.js UI for login/logout and profile display

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas connection string
- Google OAuth credentials (Client ID and Client Secret)

## Backend Setup

1. Go to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create backend .env file with:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret
FRONTEND_URL=http://localhost:3000
PORT=5000
```

4. Run backend:

```bash
npm run dev
```

Backend runs at http://localhost:5000

## Frontend Setup

1. Go to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create frontend .env.local file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run frontend:

```bash
npm run dev
```

Frontend runs at http://localhost:3000

## OAuth URLs for Local Development

Set these in Google Cloud OAuth app settings:

- Authorized JavaScript origin: http://localhost:3000
- Authorized redirect URI: http://localhost:5000/api/auth/google/callback

## Deployment Notes

- Use MongoDB Atlas in production (not Compass).
- Deploy backend first, then set frontend API URL to backend domain.
- Update OAuth settings with deployed frontend/backend URLs.
- In production backend env:
  - NODE_ENV=production
  - FRONTEND_URL=https://your-frontend-domain
  - GOOGLE_CALLBACK_URL=https://your-backend-domain/api/auth/google/callback
