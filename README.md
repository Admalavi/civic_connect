# 🌍 CivicConnect

### Report Issues. Track Progress. Build Better Communities.

CivicConnect is a full-stack civic issue reporting platform that empowers citizens to report local problems such as potholes, garbage accumulation, broken streetlights, and water leakage. It features map-based location tracking, photo uploads, complaint tracking, and admin management to build cleaner, smarter communities.

## ✨ Features
- 📸 Report civic issues with photos and descriptions
- 📍 Map-based location tracking
- 📋 Track complaint status and progress
- 🛠️ Admin dashboard for complaint management
- 🔐 Secure authentication with JWT
- ☁️ Cloudinary integration for image uploads

## 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Image Storage:** Cloudinary
- **Maps:** Map integration

## ⚙️ Setup

### 1. Install Dependencies
Run from the project root:

```bash
npm run install:all
```

### 2. Configure Environment Variables

```powershell
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Edit the environment files with your configuration. The client `.env` file is optional.

### 3. Configure MongoDB

For local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/civicconnect
```

For MongoDB Atlas, create a cluster and database user, allow your IP under **Network Access**, and add your Atlas connection string to `MONGO_URI`.

### 4. Configure JWT

Add a long, random secret to `server/.env`:

```env
JWT_SECRET=your_long_random_secret
```

**Never commit `.env` files or expose your secrets publicly.**

### 5. Configure Cloudinary (Optional)

For photo uploads, create a free account at [Cloudinary](https://cloudinary.com/) and add your Cloud Name, API Key, and API Secret to `server/.env` using the corresponding `CLOUDINARY_*` variables.

Without Cloudinary configuration, complaints without photos can still be submitted.

### 6. Create the First Admin

```bash
npm run create-admin -- you@example.com "StrongPass123" "Admin Name"
```

Replace the example email, password, and name with your own values. Public registration is restricted to citizen accounts.

### 7. Run the Application

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000

## 🎯 Our Mission

To connect citizens and local authorities through technology, encouraging faster reporting, transparent tracking, and better communities.

**Built with 💚 for cleaner, safer, and smarter cities.**
