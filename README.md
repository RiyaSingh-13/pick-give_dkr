# Pick&Give (ngo-connect-v2) 🚚💨    (deployed link- https://pick-give-mern-1.onrender.com/)

A premium, full-stack **MERN** application designed to seamlessly bridge the gap between kind-hearted donors, volunteer couriers, and verified Non-Governmental Organizations (NGOs). 

Pick&Give provides a reliable, transparent platform to post material donations (clothing, food, books, toys, furniture, medical supplies, electronics), route volunteer drivers using an interactive GPS route navigator, and coordinate emergency material requests.

---

## 🌟 Key Features

### 👤 Member / Donor Role
- **Direct Material Donations**: Post offers with categories, description, pickup instructions, and pictures.
- **Interactive Mapping**: Pin exact pickup coordinates using an interactive OpenStreetMap component.
- **Volunteer Delivery Mode**: Option to select dynamic volunteer pickup (coordinating with a live courier) or self-delivery.
- **Secure OTP Verification**: Generates a secure pickup OTP to ensure the donation reaches the correct volunteer.

### 🏫 NGO (Non-Governmental Organization) Role
- **Verification Pipeline**: Register with registration numbers and certificate uploads. NGO access remains `Pending` until verified by an Admin.
- **Request Posting**: Create, edit, and manage emergency/active material requests (categorized by urgency: Low, Medium, High).
- **Offer Acceptance**: Browse donor postings and claim accepted offers directly to assign them for routing.

### 🚚 Volunteer Courier Role
- **Live Dispatch Dashboard**: Browse accepted donations waiting for pickup.
- **GPS Route Navigator**: View a vector route map from the donor's coordinates to the destination NGO, featuring street overlays and a moving truck indicator.
- **OTP Verification**: Validate deliveries securely using the donor's unique pickup OTP.

### 👑 System Admin Role
- **NGO Approvals**: Verify and approve/reject registering NGOs to maintain platform integrity.
- **Audit Logs**: Access complete security logs, system audit logs, and account creation events.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries |
| :--- | :--- | :--- |
| **Frontend** | React (v19) + Vite | TailwindCSS (Styling), Lucide React (Icons), Leaflet.js (Mapping) |
| **Backend** | Node.js + Express.js | Mongoose ODM, Cors, Dotenv |
| **Database** | MongoDB Atlas | Relational reference schemas for Users, Donations, Requests, and Logs |
| **Hosting** | Render | Deployed as a Web Service (Backend) and a Static Site (Frontend) |

---

## 📂 Project Directory Structure

```text
ngo-connect-v2/
├── backend/                  # Node.js + Express API Backend
│   ├── config/               # DB Connection settings
│   ├── controllers/          # Business logic handlers (Donations, Requests, Users, Audits)
│   ├── models/               # Mongoose DB Schema Definitions (User, Donation, Request, AuditLog)
│   ├── routes/               # API endpoint route mappers
│   ├── seed.js               # Automatic database initialization seed
│   ├── server.js             # Main server entrypoint
│   └── .env                  # Local backend configuration (ignored in Git)
├── frontend/                 # React + Vite Frontend
│   ├── public/               # Public assets (favicons, static SVGs)
│   ├── src/                  # React source files
│   │   ├── assets/           # Theme illustrations & images
│   │   ├── components/       # Reusable components (e.g. Logo)
│   │   ├── App.jsx           # Main Single Page App controller & state router
│   │   └── index.css         # Styling system & Tailwind utilities
│   ├── vite.config.js        # Vite configuration settings
│   └── .env                  # Local frontend configuration (ignored in Git)
└── deploy_render_guide.md    # Render Deployment step-by-step documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed locally (v18+ recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### Setup Instructions

#### 1. Setup Backend
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/pick-and-give
   ```
4. Start the backend:
   - For development (with hot reload): `npm run dev`
   - Normal start: `npm start`

> [!TIP]
> The backend features **auto-seeding**. If the MongoDB database is empty, the server automatically boots up by creating a default Admin account:
> - **Username:** `admin@gmail.com`
> - **Password:** `admin123`

#### 2. Setup Frontend
1. Navigate into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory (for local routing tracking):
   ```env
   VITE_API_URL=http://localhost:5001
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment (Render)

For step-by-step instructions on deploying the application live, please refer to the detailed [Render Deployment Guide](file:///Users/riyasingh/ngo-connect-v2/deploy_render_guide.md).

### Quick Deployment Configuration Reference:

#### Backend (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Required Env Variables:** `MONGODB_URI`
- **Health Check Path:** `/api/ping`

#### Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Required Env Variables:** `VITE_API_URL` (Points to the deployed backend URL)
- **Rewrite Rule:** Source `/*` ➔ Destination `/index.html` (Action: `Rewrite`) to support page refreshes.

---

## 📄 License
This project is open-source and available under the MIT License. ***
