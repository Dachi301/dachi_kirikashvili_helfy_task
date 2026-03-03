# Task Manager App

A full-stack task management app built with React and TypeScript on the frontend and Express on the backend. You can create, edit, delete and reorder tasks with infinite scroll, drag and drop support, and a dark/light mode toggle.

## Screenshots

### Light Mode
![Light mode overview](frontend/public/light-1.png)
![Light mode task list](frontend/public/light-2.png)

### Dark Mode
![Dark mode overview](frontend/public/dark-1.png)
![Dark mode task list](frontend/public/dark-2.png)

## Setup

**Backend**

```bash
cd backend
npm install
npm start
```

Runs on http://localhost:4000

**Frontend**

```bash
cd frontend
npm install
npm start
```

Runs on http://localhost:3000

## API Endpoints

```
GET    /api/tasks              - Get all tasks (page, limit, sort, completed)
POST   /api/tasks              - Create a task
PUT    /api/tasks/:id          - Update a task
DELETE /api/tasks/:id          - Delete a task
PATCH  /api/tasks/:id/toggle   - Toggle completed status
```

GET /api/tasks accepts the following query params: `page`, `limit`, `sort` (title, priority, createdAt), `completed` (true/false).

## Design Decisions

Task data is stored in a plain in-memory array on the backend so there are no database dependencies to set up. The downside is that data resets when the server restarts.

Custom drag order is persisted in localStorage on the client side. When you pick an explicit sort option the saved drag order is ignored and the API sort result is used instead.

Pagination is handled server-side to keep the initial load fast. The frontend uses IntersectionObserver on a sentinel element at the bottom of the list to know when to fetch the next page.

Drag and drop is implemented with mousedown/mouseenter/mouseup events rather than the native HTML5 Drag API because the native API has inconsistent behavior and gives little control over visual feedback. Items swap positions live as you drag.

## Time Spent

Frontend: ~3 hours  
Backend: ~1.5 hours  
Total: ~4.5 hours
