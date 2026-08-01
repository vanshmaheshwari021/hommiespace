# 🛋️ HommieSpace — Quiet Luxury E-Commerce Marketplace

> **HommieSpace** is an end-to-end, multi-vendor luxury furniture and home decor e-commerce platform built with React 19, TypeScript, Vite, Express, and MongoDB.

---

## 🔑 Complete Credentials & Account Access Matrix

| Account Portal / Service | Full User Name | Role | Login Email / Username | Password | Storefront / Portal URL | Local Dev URL |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **🛍️ Customer Storefront Home** | `Guest Visitor` | Public | N/A | N/A | [https://hommiespace.vercel.app](https://hommiespace.vercel.app) | `http://localhost:5173` |
| **🛍️ Customer Account Sign In** | `Valued Customer` | Customer | `customer@hommiespace.com` | `password123` | [https://hommiespace.vercel.app/login](https://hommiespace.vercel.app/login) | `http://localhost:5173/login` |
| **🛍️ Registered Customer Demo** | `Vansh Maheshwari` | Customer | `vansh@example.com` | `password123` | [https://hommiespace.vercel.app/login](https://hommiespace.vercel.app/login) | `http://localhost:5173/login` |
| **👑 Super Admin Executive Portal** | `Super Administrator` | Super Admin | `admin@hommiespace.com` | `password123` | [https://hommiespace-admin.vercel.app/login](https://hommiespace-admin.vercel.app/login) | `http://localhost:5180/login` |
| **🏬 Vendor Partner Studio** | `Nordic Craft Studio` | Vendor Partner | `vendor@hommiespace.com` | `password123` | [https://hommiespace-admin.vercel.app/login](https://hommiespace-admin.vercel.app/login) | `http://localhost:5180/login` |
| **⚙️ Express REST API Backend** | `Backend Service` | API Endpoint | N/A | N/A | [https://hommiespace-api.onrender.com/api](https://hommiespace-api.onrender.com/api) | `http://localhost:5000/api` |

---

## 🏗️ Architecture & Monorepo Structure

```
2necom/
├── apps/
│   ├── web/               # Customer Storefront Web App (Vercel) -> https://hommiespace.vercel.app
│   ├── admin/             # Executive Admin & Vendor Partner Portal (Vercel) -> https://hommiespace-admin.vercel.app
│   └── api/               # Express REST API Backend & MongoDB Models (Render) -> https://hommiespace-api.onrender.com
├── packages/
│   ├── ui/                # Shared Design System Components (Card, Table, Button, etc.)
│   └── shared/            # Shared TypeScript Interfaces, Schemas & Utils
├── render.yaml            # Render.com Backend API Blueprint
└── package.json           # Monorepo Workspace Configuration
```

---

## ✨ Highlights & Key Features

1. **👑 Super Admin Executive Management**:
   - **Customer Orders Manager**: Real-time customer order processing, shipment status lifecycle updates (**Confirmed ➔ Processing ➔ Shipped ➔ Delivered**), and invoice printing.
   - **Live Search & Filters**: Instant search by Customer Name, Order ID, or Product Name. Filters for Shipment Status, Payment Status, and Amount Sorting.
   - **Vendor Approvals & Moderation**: Review partner studio applications and commission rates.

2. **🏬 Vendor Partner Studio**:
   - **Studio Onboarding**: Complete business verification, GST/PAN details, and store profile.
   - **Product Management**: List Scandinavian furniture pieces with multi-color variants and stock tracking.

3. **🛍️ Storefront & Customer Portal**:
   - **PIN Code Auto-Location Lookup**: Type any 6-digit Indian PIN code (e.g. `110001`, `400001`, `560001`) to automatically select Country, State, and City.
   - **Country-State-City Hierarchy**: Dynamic multi-country location matrix (`India`, `Sweden`, `United States`, `United Kingdom`, etc.).
   - **Order Timeline & History**: Customer profile page (`/profile`) displays order tracking timeline alongside past purchase history.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+`
- **npm**: `v9+`
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI

### 2. Installation
```bash
git clone https://github.com/vanshmaheshwari021/hommiespace.git
cd hommiespace
npm install
```

### 3. Running Services
Run backend API and frontend apps in separate terminals:

```bash
# Terminal 1: Backend Express API (Port 5000)
npm run dev:api

# Terminal 2: Customer Storefront Web App (Port 5173)
npm run dev --workspace=apps/web

# Terminal 3: Executive Admin & Vendor Portal (Port 5180)
npm run dev --workspace=apps/admin
```

---

## 🚢 How to Deploy to Vercel & Render

### 1. Express Backend API (`apps/api` on Render.com)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New Web Service** and connect your GitHub repository `vanshmaheshwari021/hommiespace`.
3. Set **Build Command**: `npm install && npm run build --workspace=apps/api`.
4. Set **Start Command**: `node apps/api/dist/server.js`.
5. Add **Environment Variables**:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: `hommiespace-production-jwt-secret-2026`
   - `NODE_ENV`: `production`

### 2. Storefront Web App (`apps/web` on Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import repository `vanshmaheshwari021/hommiespace`.
3. Set **Root Directory**: `apps/web`.
4. Set **Environment Variable**:
   - `VITE_API_URL`: `https://hommiespace-api.onrender.com/api`

### 3. Super Admin & Vendor Portal (`apps/admin` on Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import repository `vanshmaheshwari021/hommiespace`.
3. Set **Root Directory**: `apps/admin`.
4. Set **Environment Variable**:
   - `VITE_API_URL`: `https://hommiespace-api.onrender.com/api`

---

## 📜 Git Repository

- **Repository**: [https://github.com/vanshmaheshwari021/hommiespace.git](https://github.com/vanshmaheshwari021/hommiespace.git)
- **Primary Branches**: `main`, `dev`

---

© 2026 **HommieSpace Design Inc.** All Rights Reserved.
