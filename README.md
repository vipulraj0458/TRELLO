# Trello Clone - Full-Stack Kanban Application

A professional, high-performance Kanban-style project management application built with **React**, **Node.js**, and **PostgreSQL**. Featuring a dynamic multi-board dashboard, smooth drag-and-drop interactions, and a fully responsive mobile-first design.

---

## 🚀 Key Features

### 📋 Board Management (Dashboard)
- **Multi-Board Workspace**: Create, manage, and switch between multiple project boards.
- **Interactive Board Cards**: Hover-based action menu (⋯) for quick board operations.
- **Full CRUD Support**: Edit board titles, customize background colors, archive projects, or delete them permanently.
- **Dynamic Grid**: Auto-adjusting board grid (1-2 cols on mobile, 4 cols on desktop).

### 🏗️ Kanban Core (Board View)
- **Dynamic Lists**: Create, rename, and archive lists within each board.
- **Card Management**: Add detailed cards to lists with title, description, and state persistence.
- **Drag & Drop Engine**: Smooth reordering of both cards and lists using `react-beautiful-dnd`.
- **Search & Filter**: Real-time card filtering by title to find what you need instantly.

### 📱 Responsive Design (Mobile-First)
- **Horizontal Swiping**: On mobile, boards switch to a swipeable horizontal layout (85% list width) for a native app feel.
- **Hamburger Menu**: Navigation links collapse into a clean drawer on small screens.
- **Touch-Friendly**: All hover interactions are optimized for tap support on touch devices.

---

## 🛠️ Tech Stack

- **Frontend**: `React (v18)`, `Vite`, `Tailwind CSS`, `Lucide-React`, `react-beautiful-dnd`, `React Router`.
- **Backend**: `Node.js`, `Express`, `PostgreSQL (pg)`, `CORS`, `Dotenv`.
- **Deployment**: `Vercel` (Frontend), `Render` (Backend).

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js**: (v16.x or higher)
- **PostgreSQL**: Local instance or hosted (e.g., Supabase, Render).

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file based on .env.example
# Add your DATABASE_URL, PORT, etc.

# Initialize Database (Tables & Seeding)
npm run db:init

# Start server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
# Add VITE_API_BASE_URL (URL of your backend)

# Start development server
npm run dev
```

---

## 🗄️ Database Schema & Initialization

The project uses a structured relational schema:
- **Boards**: `id`, `name`, `bgcolor`, `is_archived`, `created_at`.
- **Lists**: `id`, `board_id`, `title`, `position`.
- **Cards**: `id`, `list_id`, `title`, `position`, `description`.

Run **`npm run db:init`** from the `backend/` directory to automatically create all tables and seed the initial "Initial" board.

---

## 🏗️ Deployment Architecture

- **Frontend**: Deployed to **Vercel** with environment variables pointing to the Backend URL.
- **Backend**: Deployed to **Render** (as a Web Service) connected to a PostgreSQL database.
- **Database**: Hosted on **Render Persistent Disk** or a cloud provider like **Supabase**.

---

## 📂 Project Structure

```text
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # API logic
│   ├── routes/          # REST endpoints
│   ├── scripts/         # init-db.js initialization script
│   └── server.js        # Main entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API calls
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Landing, Board)
│   │   ├── context/     # React Context for board state
│   │   └── utils/       # Helper functions
│   └── tailwind.config.js
└── README.md
```

---

## 👋 Contributing

Feel free to fork this project and submit pull requests for any features or bug fixes.
