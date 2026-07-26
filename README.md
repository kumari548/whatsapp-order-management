# 💬 ShopOrders — WhatsApp Order Management System

A full-stack SaaS application that lets small shop owners (kirana stores, tiffin centers, grocers) receive, manage, and fulfill customer orders entirely through **WhatsApp** — no app download required for customers.

Customers text their order naturally in plain language. AI extracts the items, quantities, and delivery time automatically, saves it to the database, and sends an instant confirmation — all while the shop owner tracks everything live on a secure web dashboard.

🔗 **Live demo:** [whatsapp-order-vert.vercel.app](https://whatsapp-order-vert.vercel.app)

---

## ✨ Features

- **WhatsApp order intake** — customers message naturally (e.g. *"1kg rice, 2 oil, deliver by 6pm"*) with no rigid format required
- **AI-powered parsing** — Groq (Llama 3.3 70B) extracts structured order data from free-form text
- **Automatic customer confirmation** — instant WhatsApp reply once an order is received
- **Secure dashboard** — JWT-authenticated login protects all shop data
- **Live order tracking** — dashboard auto-refreshes every 10 seconds
- **Products & Categories** — full catalog management with image uploads
- **Inventory management** — stock tracking with low-stock alerts
- **Customer directory** — auto-generated from order history with order counts
- **Delivery tracking** — assign delivery persons and track status
- **Analytics** — top products, top customers, revenue summaries, order breakdowns
- **CSV reports** — one-click export of order data
- **AI shop assistant** — chat interface to ask questions about your own shop data
- **Rate limiting & input sanitization** — protects the WhatsApp webhook from spam/abuse

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios
- Custom glassmorphism UI (no UI framework — hand-built design system)

**Backend**
- Node.js + Express
- PostgreSQL
- JWT authentication
- express-rate-limit

**Integrations**
- Twilio WhatsApp API (message send/receive)
- Groq API — Llama 3.3 70B for natural language order parsing

**Deployment**
- Backend + Database → Railway
- Frontend → Vercel

---

## 🏗️ Architecture

```
Customer (WhatsApp)
        │
        ▼
  Twilio WhatsApp API
        │
        ▼
  Node.js/Express Backend  ──────►  PostgreSQL Database
        │                                   ▲
        ▼                                   │
  Groq AI (order parsing)                   │
        │                                   │
        ▼                                   │
  Auto-confirmation to customer             │
                                             │
  React Dashboard (Vercel)  ─────────────────┘
  (Login → Orders, Inventory, Products,
   Categories, Customers, Deliveries,
   Analytics, Reports, AI Assistant)
```

---

## 📂 Project Structure

```
whatsapp-orders/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── webhook.js       # Receives WhatsApp messages
│   │   ├── orders.js
│   │   ├── inventory.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── customers.js
│   │   ├── deliveries.js
│   │   └── auth.js
│   ├── services/
│   │   ├── aiParser.js      # Groq AI order parsing
│   │   ├── twilioService.js # Send WhatsApp replies
│   │   └── orderService.js
│   └── db/
│       └── connect.js
│
└── frontend/
    └── src/
        ├── pages/           # Dashboard, Orders, Inventory, Products,
        │                    # Categories, Customers, Deliveries, Analytics,
        │                    # Reports, AI Assistant, Notifications,
        │                    # Settings, Profile, Login
        └── components/
            ├── Sidebar.jsx
            └── PageLayout.jsx
```

---

## ⚙️ Environment Variables

**Backend (`backend/.env`)**
```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
GROQ_API_KEY=
DATABASE_URL=
DASHBOARD_USERNAME=
DASHBOARD_PASSWORD=
JWT_SECRET=
PORT=3000
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=
VITE_GROQ_API_KEY=
```

---

## 🚀 Running Locally

```bash
# Backend
cd backend
npm install
node server.js

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

To receive real WhatsApp messages locally, expose your backend with [ngrok](https://ngrok.com) and point the Twilio Sandbox webhook to `https://<your-ngrok-url>/webhook`.

---

## 📸 Screenshots

*(Add dashboard, orders, and products page screenshots here)*

---

## 🗺️ Roadmap

- [ ] Multi-shop support (separate accounts per shop owner)
- [ ] Link AI order parsing to the real product catalog for accurate pricing
- [ ] WhatsApp Business API (removes sandbox 72-hour join requirement)
- [ ] Settings/Profile data moved from localStorage to database

---

## 👤 Author

Built by **Aravind** as a full-stack portfolio project — end-to-end WhatsApp automation, AI integration, and a complete multi-page admin dashboard, deployed and live.