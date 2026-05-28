# Nexxora Web

Next.js frontend for Nexxora. This app contains the customer storefront, customer dashboard pages, admin dashboard pages, route protection middleware, and reusable UI components.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Icons
- Framer Motion
- react-hot-toast
- clsx
- tailwind-merge
- Fetch API

## Folder Overview

```txt
web/
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   └── customer/
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── components/
├── lib/
├── public/
├── types/
├── middleware.ts
├── .env.local.example
├── package.json
└── tsconfig.json
```

## Features

- Customer navbar
- Admin sidebar
- Login and register
- Product catalog
- Product detail
- Cart
- Coupon input
- Checkout with saved address
- RajaOngkir destination search and shipping selection
- Xendit payment redirect
- Payment status pages
- Order list and order detail
- Notification page
- Profile and avatar update
- Animated error pages

## Environment

Create local env:

```bash
cp .env.local.example .env.local
```

Required:

```env
NEXT_PUBLIC_API_URL="http://localhost:8000/api"
```

Do not commit `.env.local`.

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start production build:

```bash
npm run start
```

## Routing

The app uses clean customer/admin URLs through middleware while keeping the internal page structure organized under dashboard folders.

Customer-facing pages include:

- Home
- Catalog
- Search
- Cart
- Checkout
- Order
- Notification
- Profile

Admin-facing pages include:

- Dashboard
- Product
- Category
- Order
- Transaction

## Authentication

JWT is stored in browser storage and mirrored into cookies for middleware checks. Admin pages are protected by role-based routing. The middleware confirms access using the backend auth session before allowing admin routes.

## UI Notes

- Components live under `components`.
- API helpers live in `lib/api.ts`.
- Formatting helpers live in `lib/format.ts`.
- Shared type definitions live in `types`.
- Product images use `next/image`.
- Icons use `react-icons`.
- Page and card animations use `framer-motion`.
