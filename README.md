# AI Health Companion 🌟

An empathetic, interactive wellness companion designed to support daily self-reflection, build healthy habits, and provide helpful guidance. The application is composed of a responsive React frontend and a robust Node.js/Express backend integrated with MongoDB and the Groq API.

---

# Live Link :-  https://ai-mental-health-qyxd.vercel.app/

## 🚀 Key Features

### 💬 AI Chat Companion
* **Empathetic Reflections:** Talk to a wellness check-in assistant designed with supportive, evidence-informed guidance guidelines.
* **Crisis Safety:** Automatic crisis language detection that intercepts distressing messages and immediately recommends trusted support hotlines.
* **Topic Enforcement:** Politely redirects off-topic conversations back to health, mindfulness, and self-care.

### 📅 Daily Check-Ins & Streaks
* **Mood, Stress & Energy Sliders:** Input logs on how you are feeling.
* **Daily Logging Limit:** Enforces a strict one check-in per day limit, displaying a clean status badge and notification once you have checked in.
* **Interactive Progress Analytics:** Visually monitors mood, stress, and energy levels over time via interactive line charts.
* **Streaks Counter:** Tracks consecutive check-in days using a flame streak metric.

### 📋 Smart Routine Builder
* **AI-Generated Routines:** Enter a concern (e.g. stress, sleep, motivation) to automatically generate actionable daily routines using Groq AI.
* **Standard Templates:** Quick-start routines using standard templates.
* **Interactive Progress Checklist:** Check off routine items as you do them, triggering a celebratory congratulations banner once everything is checked off.
* **Midnight Auto-Reset:** Routines automatically reset to unchecked at **12:00 midnight** local time every day so you can start fresh.

### 💳 Secure Premium Subscriptions
* **Razorpay Integration:** Securely process premium upgrades using the Razorpay payment gateway.
* **Cryptographic Verification:** Backend HMAC SHA-256 signature verification prevents fraudulent transactions.
* **Instant UI Reactivity:** The UI dynamically unlocks premium features upon successful payment verification without requiring a refresh.

---

## 🛠️ Technology Stack

* **Frontend:**
  * **React & Vite** — Next-gen frontend tooling.
  * **Tailwind CSS** — Utility-first styling.
  * **Recharts** — For interactive trend charts.
  * **Lucide Icons** — Clean iconography.
  * **Razorpay SDK** — Secure checkout widget.

* **Backend:**
  * **Node.js & Express** — Web application server.
  * **Mongoose & MongoDB Atlas** — Database modeling and cloud persistence.
  * **JSON Web Tokens (JWT) & Cookies** — Secure token-based session auth.
  * **Groq API** — Integrated with Llama 3.3 for lightning-fast AI routine generation and conversational health coaching.

---

## ⚙️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org) (v18+)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
* [Groq API Key](https://console.groq.com)

### 1. Repository Setup & Environment
Clone the repository, then create a `.env` file in the **root directory** containing:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_token
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

### 2. Run the Backend Server
Navigate to the `backend` folder, install dependencies, and run:

```bash
cd backend
npm install
npm run dev
```
*The server will run on `http://localhost:3000`.*

---

### 3. Run the Frontend App
Navigate to the `frontend` folder, install dependencies, and run:

```bash
cd frontend
npm install
npm run dev
```
*The development server will launch on `http://localhost:5173`.*

---

## 📊 Performance Benchmarks

To ensure the application can scale and maintain low latency under user concurrency, we designed a custom Node.js load-testing script to benchmark both raw backend performance and real-world production metrics.

### Local Environment (Raw Express/Node.js Performance)
* **Throughput:** ~4,900 requests/second (RPS)
* **Average Latency:** 8.15 ms

### Production Environment (Vercel Serverless Deployment)
* **Real-World Latency:** ~233 ms *(Includes network transit, SSL handshake, and edge routing overhead)*.

*To run this load test yourself, run `node tests/loadTest.js` inside the `backend` folder.*
