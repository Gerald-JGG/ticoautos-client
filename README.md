# TicoAutos — Frontend

> Modern vehicle marketplace for Costa Rica, built with Next.js 14 and a dark, minimalist design.

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Features](#pages--features)
- [Key Components](#key-components)

---

## About

TicoAutos is a client-side application that connects to the TicoAutos REST API. It allows users to browse vehicles, publish listings, ask questions to sellers, and manage their own inventory — all with a clean dark-mode interface.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | React framework |
| **TypeScript** | Type safety |
| **Axios** | HTTP client |
| **react-hot-toast** | Toast notifications |
| **lucide-react** | Icon library |
| **CSS Variables** | Custom theming (dark mode) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home — vehicle listing with filters
│   ├── layout.tsx                  # Root layout with Navbar and Toaster
│   ├── globals.css                 # Global styles and CSS design system
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Register page
│   ├── dashboard/
│   │   ├── my-vehicles/page.tsx    # Manage own vehicle listings
│   │   └── inbox/page.tsx          # Questions inbox (received + sent)
│   └── vehicles/
│       └── [id]/page.tsx           # Vehicle detail with Q&A section
├── components/
│   ├── layout/
│   │   └── Navbar.tsx              # Fixed top navigation bar
│   └── vehicles/
│       ├── VehicleCard.tsx         # Vehicle card for grid listings
│       ├── VehicleForm.tsx         # Create/edit vehicle form
│       └── FilterBar.tsx           # Search and filter controls
├── hooks/
│   └── useAuth.tsx                 # Auth context (user, token, login, logout)
├── lib/
│   ├── api.ts                      # Axios instance with JWT interceptors
│   ├── auth-api.ts                 # Auth API calls (register, login)
│   ├── vehicles-api.ts             # Vehicle API calls
│   └── questions-api.ts            # Questions & answers API calls
└── types/
    └── index.ts                    # TypeScript interfaces (User, Vehicle, Question, Answer...)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- TicoAutos API running on `http://localhost:3001`

### Installation

```bash
# Clone the repository
git clone https://github.com/Gerald-JGG/ticoautos-client
cd ticonautos-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your values (see below)

# Run in development mode
npm run dev
```

The app will be available at: `http://localhost:3000`

---

## Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Pages & Features

### 🏠 Home (`/`)
- Grid of all available vehicles
- Sticky search bar with text search
- Advanced filters: brand, model, year range, price range, status
- Pagination with page controls
- Total results counter

### 🔐 Login (`/auth/login`)
- Email and password form
- Show/hide password toggle
- Redirects to home on success
- Validates fields before submitting

### 📝 Register (`/auth/register`)
- Name, email, password, optional phone
- Frontend validation (required fields, min password length)
- Auto-login after successful registration

### 🚘 Vehicle Detail (`/vehicles/[id]`)
- Image gallery with thumbnail selector
- Full specs: year, mileage, fuel, transmission, color
- Seller info: name, email, phone
- Share button that copies URL to clipboard
- Public Q&A section visible to everyone
- Question form (authenticated users only, min 5 chars)
- Owner answer form (only visible to vehicle owner)

### 📋 My Vehicles (`/dashboard/my-vehicles`)
- List of own vehicle listings
- Create new listing with inline form
- Edit existing vehicles
- Mark as sold
- Delete with confirmation prompt

### 📬 Inbox (`/dashboard/inbox`)
- **Tab 1 — Received questions:** all questions on owned vehicles, with reply form
- **Tab 2 — My questions:** questions asked by the user, shows answers when available
- Unanswered questions counter
- Inline reply with Enter key support

---

## Key Components

### `useAuth` hook
Global auth context stored in `localStorage`. Provides `user`, `token`, `login()`, `logout()` and `isLoading` to the entire app. The Axios interceptor automatically attaches the token to every request and redirects to `/auth/login` on 401 responses.

### `FilterBar`
Sticky filter bar below the navbar. Supports text search + 6 combinable filters. Filters are sent as query params to the backend — no client-side filtering.

### `VehicleForm`
Reusable form for creating and editing vehicles. Supports image URL management (add/remove previews). Validates all required fields before submitting.

### `VehicleCard`
Displays vehicle image, price, specs and status badge. Supports an optional `showActions` mode for the owner dashboard (edit, mark sold, delete buttons).

---

## Design System

The app uses a custom dark-mode CSS design system defined in `globals.css` with CSS variables:

```css
--bg: #0a0a0a          /* Page background */
--amber: #f59e0b       /* Primary accent color */
--text: #f0f0f0        /* Primary text */
--text-2: #a0a0a0      /* Secondary text */
--border: #2a2a2a      /* Border color */
```

Typography uses **Syne** (headings/display) and **DM Sans** (body) from Google Fonts.

---

## Course Info

**Course:** Programación en Ambiente Web II (ISW-711)  
**University:** Universidad Técnica Nacional  
**Professor:** Bladimir Arroyo
