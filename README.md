# CivicConnect – Map-Based Civic Issue Reporting (MERN)
React+Vite+Tailwind, Leaflet/OpenStreetMap, Express, MongoDB/Mongoose, JWT, Cloudinary.

## Prerequisites (Windows)
Node.js 18+ (nodejs.org), Git optional, MongoDB Community (local, default port 27017) **or** a free MongoDB Atlas cluster.

## Setup
1. `npm run install:all` (from this folder; installs root, server, client).
2. `copy server\.env.example server\.env` and edit values. Optional: `copy client\.env.example client\.env`.
3. **MongoDB**: Local → `MONGO_URI=mongodb://127.0.0.1:27017/civicconnect`. Atlas → create cluster, add a database user, allow your IP under Network Access, copy the `mongodb+srv://...` string into `MONGO_URI`.
4. **JWT_SECRET**: any long random string. Never commit `.env`.
5. **Cloudinary** (needed only for photo upload): create a free account at cloudinary.com, copy Cloud name, API Key, API Secret from the dashboard into `CLOUDINARY_*` in `server/.env`. Secrets stay server-side. Without them, submitting a photo returns a clear 503 setup error (complaints without photos still work).
6. **First admin** (no hard-coded credentials): `npm run create-admin -- you@example.com "StrongPass123" "Admin Name"`. Public registration only creates citizens.
7. Run: `npm run dev` → client http://localhost:5173, API http://localhost:5000.

## Features
Public issue map (category/status filters, status-colored markers, popups, fit-to-bounds, empty state), report form with click/drag/geolocation/Nominatim search, photo preview, rule-based duplicate warning (not AI; radius `DUPLICATE_RADIUS_M`, default 100 m), status timeline, citizen & admin dashboards (MongoDB aggregation), admin status updates with remarks, pagination/search/sort.

## API (prefix /api)
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /complaints` (page, limit, q, category, status, sort) · `GET /complaints/map` · `GET /complaints/nearby?lat&lng&radius` · `GET /complaints/duplicates?lat&lng&category`
- `GET /complaints/mine` (auth) · `GET /complaints/:complaintId` · `POST /complaints` (auth, multipart: title, description, category, address, lat, lng, photo)
- `PUT /complaints/:id`, `DELETE /complaints/:id` (owner, Pending only) · `PATCH /complaints/:id/status` (admin; `{status, remark}`)
- `GET /stats?scope=me|all` (auth; `all` is admin only)

## Schema
**User**: name, email (unique), password (bcrypt hash, not selected by default), role (citizen|admin), timestamps.
**Complaint**: complaintId (unique), title, description, category, photoUrl, location (GeoJSON Point `[lng,lat]`, 2dsphere index), address, status, citizen (ref User; never returned publicly), statusHistory[{from,to,by,remark,at}], timestamps.

## Troubleshooting
- `MongoDB connection failed`: start the MongoDB service, or check Atlas IP allow-list/password (URL-encode special characters).
- `Missing MONGO_URI or JWT_SECRET`: create `server/.env`.
- CORS/network errors: keep `CLIENT_URL` equal to the client origin; API must run on port 5000 (or set `VITE_API_URL`).
- Upload 503: fill `CLOUDINARY_*`.
- Address search uses public Nominatim (1 request/second policy; searches only on submit).

## Known limitations
Admin category management UI and complaint edit UI are not included (edit exists as API). No automated tests. Uses `bcryptjs` (pure-JS bcrypt, avoids Windows build tools).
