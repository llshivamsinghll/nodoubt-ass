# Posts Application

A full-stack web application with React frontend, Node.js/Express backend, MongoDB database, and WebSocket real-time search.

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render

## Live URLs

- Frontend: https://nodoubt-ass-frontend11.vercel.app
- Backend API: https://nodoubt-ass.onrender.com
- Backend WebSocket: wss://nodoubt-ass.onrender.com

## How to Run Locally

### Prerequisites
- Node.js (v14+)
- Yarn package manager
- MongoDB Atlas account (free tier)

### [!] Important: Start Backend First!

**The backend must be running before the frontend tries to connect to the WebSocket.**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Edit `.env` and add your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/postsdb?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

4. Install dependencies:
```bash
yarn install
```

5. Start the backend server:
```bash
yarn dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

In a new terminal, navigate to the frontend directory:

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
yarn install
```

4. Start the development server:
```bash
yarn dev
```

The frontend will run on `http://localhost:3000`

5. Open your browser and visit: `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/postsdb?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

- `MONGODB_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

- `VITE_API_URL` - Backend REST API URL
- `VITE_WS_URL` - Backend WebSocket URL

## Features

- **Real-time Search with WebSocket** - Search posts in real-time
- **Shortlisting & Organization** - Favorite posts, bookmark for later, add ratings
- **Post Management** - Rate posts (1-5 stars), add tags, personal notes, reading status
- **Collections** - Create and manage custom post collections
- **Fetch from JSONPlaceholder API** - Automatic data import
- **MongoDB Storage** - Persistent data in MongoDB Atlas
- **Responsive UI** - Beautiful React frontend with Vite
- **SVG Icons** - Clean, scalable vector icons throughout the app
- **Client-side Search Fallback** - Search works even if WebSocket disconnects

## Shortlisting Features

### Favorites
Click the heart icon to mark posts as favorites for quick access.

### Bookmarks
Click the bookmark icon to save posts for later reading without marking as favorites.

### Rating System
Rate posts from 1-5 stars to identify high-quality content and sort by quality.

### Collections
Create custom collections to organize posts by topic, project, or theme:
- Create new collections
- Add/remove posts from collections
- Share collections (future feature)

### Additional Features
- **Reading Status** - Track whether posts are unread, being read, or completed
- **Personal Notes** - Add annotations and references to posts
- **Tags** - Categorize posts with custom tags for better organization

## REST API Endpoints

### Posts
- `POST /api/posts/fetch-and-save` - Fetch from JSONPlaceholder and save to MongoDB
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `PATCH /api/posts/:id/favorite` - Toggle favorite status
- `PATCH /api/posts/:id/bookmark` - Toggle bookmark status
- `PATCH /api/posts/:id/rate` - Rate a post
- `PATCH /api/posts/:id/tags/add` - Add tags
- `PATCH /api/posts/:id/tags/remove` - Remove tags
- `PATCH /api/posts/:id/reading-status` - Update reading status (unread/reading/completed)
- `PATCH /api/posts/:id/notes` - Add personal notes

### Collections
- `POST /api/collections` - Create new collection
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get collection with posts
- `PATCH /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `POST /api/collections/:collectionId/posts/:postId` - Add post to collection
- `DELETE /api/collections/:collectionId/posts/:postId` - Remove post from collection

### WebSocket
- `type: 'search'` - Real-time search with query parameter

## Clear Database

To clear all posts from the database, run:

```bash
cd backend
yarn clear-db
```

## Troubleshooting

### WebSocket Error: "WebSocket is closed before the connection is established"

**Cause**: The backend server is either not running or encountered an error during startup.

**Solution**:
1. **Check if backend is running**: Look for these messages in the backend terminal:
   ```
   [✓] Server running on http://localhost:5000
   [↔] WebSocket server running on ws://localhost:5000
   ```

2. **Restart backend with improved error handling**:
   ```bash
   cd backend
   yarn dev
   ```
   The updated backend now provides better logging and will start even if MongoDB has connection issues.

3. **Test backend connectivity**:
   ```bash
   cd backend
   node test-backend.js
   ```
   This will verify HTTP and WebSocket endpoints are working.

4. **Refresh frontend**: Once backend is running, refresh the browser page (Ctrl+R).

### WebSocket Error: "WebSocket error" or "WebSocket disconnected"

**Cause**: The backend server crashed or MongoDB connection failed.

**Solution**: 
1. Check the backend terminal for error messages
2. Ensure MongoDB connection string is correct in `backend/.env`
3. Verify your MongoDB cluster is active and your IP is whitelisted

### MongoDB Connection Error

**Cause**: MongoDB connection string is invalid or MongoDB is not accessible.

**Solution**:
1. Verify your `MONGODB_URI` in `backend/.env`
2. Ensure your IP address is whitelisted in MongoDB Atlas
3. Check that your MongoDB cluster is active

### Port Already in Use

**Cause**: Port 5000 or 3000 is already being used by another application.

**Solution**:
1. Change the PORT in `backend/.env` to a different port (e.g., 5001)
2. Update `VITE_API_URL` and `VITE_WS_URL` in `frontend/.env` to match
