# Photography Portfolio - Real-Time Application

A modern photography portfolio with real-time features built with Vue 3 + TypeScript frontend and Strapi v5 backend.

## Features

- 🖼️ **Dynamic Photo Gallery** - Browse photos with category filtering
- ⚡ **Real-Time Updates** - Live like counts and view tracking via WebSocket
- 📱 **Responsive Design** - Built with Tailwind CSS v4
- 🔄 **Activity Feed** - See real-time user interactions
- 🎯 **Type Safety** - Full TypeScript implementation
- 🧪 **Comprehensive Testing** - TDD approach with Vitest

## Tech Stack

### Frontend
- Vue 3 with Composition API
- TypeScript
- Tailwind CSS v4
- Pinia for state management
- Socket.IO client for real-time features
- Vitest for testing

### Backend
- Strapi v5 (Headless CMS)
- TypeScript
- Socket.IO for real-time features
- SQLite database (development)

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the automated startup script
./start.sh
```

This script will:
- Check prerequisites (Node.js 18+, pnpm)
- Install all dependencies
- Start both frontend and backend servers

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd photography-portfolio/backend
   pnpm install
   cd ../..
   
   # Frontend dependencies
   cd photography-portfolio/frontend
   pnpm install
   cd ../..
   ```

2. **Start the Application**
   ```bash
   # Start both servers concurrently
   npm run dev
   
   # Or start them separately:
   npm run dev:backend  # Strapi backend
   npm run dev:frontend # Vue frontend
   ```

## Application URLs

Once running, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:1337/api
- **Strapi Admin**: http://localhost:1337/admin

## Initial Setup Steps

### 1. Create Strapi Admin Account

1. Navigate to http://localhost:1337/admin
2. Create your admin account (first time only)
3. Complete the Strapi setup wizard

### 2. Create Photo Content Type

1. In Strapi Admin, go to **Content-Type Builder**
2. Create a new **Collection Type** called "Photo"
3. Add the following fields:
   
   **Text Fields:**
   - `title` (Short text, required)
   - `description` (Long text)
   - `category` (Short text, required)
   - `photographer` (Short text)
   
   **Media Field:**
   - `image` (Single media, required)
   
   **Number Fields:**
   - `likes` (Integer, default: 0)
   - `views` (Integer, default: 0)

4. **Save** the content type

### 3. Configure Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public** role
3. Under **Photo** permissions, enable:
   - `find` (to fetch photos)
   - `findOne` (to fetch individual photos)
   - `update` (to update like counts)
4. **Save** the changes

### 4. Add Sample Photos

1. Go to **Content Manager** → **Photo**
2. Click **Create new entry**
3. Add sample photos with:
   - Title and description
   - Category (e.g., "landscape", "portrait", "street")
   - Upload an image
   - Set initial likes/views to 0
4. **Publish** each photo

## Development Commands

```bash
# Development
npm run dev              # Start both servers
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend

# Building
npm run build            # Build both projects
npm run build:backend    # Build only backend
npm run build:frontend   # Build only frontend

# Testing
npm run test             # Run frontend tests
npm run test:coverage    # Run tests with coverage
```

## Project Structure

```
photography-portfolio/
├── backend/              # Strapi v5 backend
│   ├── config/          # Strapi configuration
│   │   ├── api/         # API routes
│   │   ├── hooks/       # Custom hooks (WebSocket)
│   │   └── extensions/  # Strapi extensions
│   └── database/        # Database files
├── frontend/            # Vue 3 frontend
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── composables/ # Vue composables
│   │   ├── services/    # API services
│   │   ├── stores/      # Pinia stores
│   │   └── types/       # TypeScript types
│   └── tests/           # Test files
└── package.json         # Root package.json
```

## Real-Time Features

The application includes several real-time features powered by Socket.IO:

- **Live Like Counts**: See likes update in real-time across all connected clients
- **View Tracking**: Automatic view counting when photos are displayed
- **Activity Feed**: Live feed of user interactions
- **Connection Status**: Visual indicator of WebSocket connection status

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Frontend-specific testing
cd photography-portfolio/frontend
pnpm run test           # Run tests
pnpm run test:coverage  # Coverage report
```

## Environment Variables

### Backend (.env)
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

### Frontend
Environment variables are handled through Vite's built-in system.

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend (1337): Kill any existing Strapi processes
   - Frontend (5173): Kill any existing Vite processes

2. **Dependencies Issues**
   - Delete `node_modules` and reinstall: `rm -rf node_modules && pnpm install`

3. **Database Issues**
   - Delete `backend/.tmp` folder to reset SQLite database

4. **WebSocket Connection Issues**
   - Check that both servers are running
   - Verify CORS settings in backend configuration

### Getting Help

If you encounter issues:
1. Check the console logs in both terminal and browser
2. Verify all dependencies are installed correctly
3. Ensure Node.js version is 18 or higher
4. Check that ports 1337 and 5173 are available

## Next Steps

After getting the app running:

1. **Add Real Photos**: Upload your photography portfolio to Strapi
2. **Customize Categories**: Modify categories to match your photography style
3. **Style Customization**: Adjust Tailwind CSS classes in components
4. **Deploy**: Consider deployment options for both frontend and backend

## Contributing

This project follows conventional commit standards and includes pre-commit hooks for code quality.

---

**Happy coding! 📸✨** 