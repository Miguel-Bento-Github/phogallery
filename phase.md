# Phase 3: Strapi Backend & Real-Time Features

## 🎉 Congratulations on Completing Phase 2!

You now have a fully functional Vue 3 photography portfolio frontend with:
- ✅ TDD workflow with comprehensive test coverage
- ✅ PhotoCard components with image loading and animations  
- ✅ Gallery with masonry layout and state management
- ✅ Routing between Gallery, About, and Contact pages
- ✅ Responsive design with Tailwind CSS v4

## Overview

Phase 3 transforms your static portfolio into a dynamic, data-driven application by:
- Setting up **Strapi v5** headless CMS backend
- Creating **content models** for photography portfolio
- Integrating **real-time features** with WebSockets and SSE
- Adding **image upload and optimization** workflows  
- Implementing **advanced testing** for full-stack functionality

## Prerequisites

- Phase 2 completed successfully ✅
- Frontend running on `http://localhost:5173` ✅
- TDD tests passing ✅
- Basic understanding of APIs and databases

## Step 1: Strapi v5 Backend Setup

### Create Strapi Project

**In a new terminal, navigate to your project root:**

```bash
# From photography-portfolio directory
cd .. # Go back to parent directory if you're in frontend/

# Create Strapi backend
pnpm dlx create-strapi@latest backend --quickstart --typescript

# This will:
# 1. Create a new Strapi v5 project with TypeScript
# 2. Install all dependencies
# 3. Create a SQLite database
# 4. Launch the admin panel at http://localhost:1337/admin
```

**Set up your admin account when prompted:**
- Email: your-email@example.com
- Password: (choose a strong password)
- Username: admin

### Configure Environment Variables

**Create `backend/.env`:**

```bash
cd backend

cat > .env << 'EOF'
# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2
API_TOKEN_SALT=toBeModified
ADMIN_JWT_SECRET=toBeModified
TRANSFER_TOKEN_SALT=toBeModified

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Upload Provider (we'll configure Cloudinary later)
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
EOF
```

### Install Additional Dependencies

```bash
# Install real-time and image processing dependencies
pnpm install socket.io cors sharp @strapi/plugin-upload

# Install development dependencies
pnpm install -D @types/socket.io
```

## Step 2: Content Modeling for Photography Portfolio

### Create Photo Content Type

**In Strapi Admin Panel (http://localhost:1337/admin):**

1. **Go to Content-Type Builder**
2. **Create Collection Type**: `photo`
3. **Add Fields:**

**Basic Information:**
- `title` (Text) - Required, Short text
- `description` (Rich Text) - Long text with markdown
- `slug` (UID) - Target field: title

**Media:**
- `image` (Media) - Required, Single image
- `thumbnail` (Media) - Single image (auto-generated)

**Classification:**
- `category` (Enumeration) - Values: `portrait`, `landscape`, `street`, `wildlife`, `macro`, `wedding`
- `tags` (JSON) - For flexible tagging
- `featured` (Boolean) - Default: false

**Metadata:**
- `cameraSettings` (Component) - Create component first
- `location` (Text) - Short text
- `captureDate` (Date)

**Engagement:**
- `viewCount` (Number) - Default: 0
- `likeCount` (Number) - Default: 0

### Create Camera Settings Component

1. **Go to Content-Type Builder**
2. **Create Component**: `photography.camera-settings`
3. **Add Fields:**
   - `camera` (Text) - Short text
   - `lens` (Text) - Short text  
   - `aperture` (Text) - Short text (e.g., "f/2.8")
   - `shutterSpeed` (Text) - Short text (e.g., "1/125")
   - `iso` (Number) - Integer
   - `focalLength` (Text) - Short text (e.g., "85mm")

### Create Gallery Content Type

1. **Create Collection Type**: `gallery`
2. **Add Fields:**
   - `name` (Text) - Required
   - `description` (Rich Text)
   - `coverImage` (Media) - Single image
   - `photos` (Relation) - Photo has and belongs to many Galleries

### Create Like Content Type

1. **Create Collection Type**: `like`
2. **Add Fields:**
   - `photo` (Relation) - Like belongs to one Photo
   - `ipAddress` (Text) - For anonymous likes
   - `sessionId` (Text) - For tracking

**Save and publish all content types.**

## Step 3: Configure Permissions and API Access

### Set Public Permissions

**In Strapi Admin: