# E-commerce REST API

A comprehensive, production-ready e-commerce REST API built with Node.js, Express, TypeScript, and MongoDB. Features secure authentication via Clerk, role-based access control, image uploads via Cloudinary, and is fully configured for deployment on Vercel.

---

## Features

- **Product Management:** Full CRUD for products with multi-image uploads (admin-only).
- **Shopping Cart:** Per-user cart with add, update, remove, and clear operations.
- **Orders:** Users can place orders; admins can view all orders and update order status.
- **Address Management:** Users can manage multiple shipping addresses.
- **Wishlist:** Users can add or remove products from their personal wishlist.
- **Admin Dashboard:** Secure endpoint for aggregated dashboard statistics.
- **Authentication:** Stateless authentication using Clerk tokens (Bearer).
- **Authorization:** Middleware-based role checks (`user` vs `admin`).
- **Webhooks:** Dedicated endpoint to sync Clerk user events.
- **Seeding:** Automatic seeding of an admin user and dummy products on startup.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **TypeScript** | Type safety (`tsx` for runtime execution) |
| **MongoDB & Mongoose** | Database & ODM |
| **Clerk** | Authentication & user management |
| **Cloudinary** | Image hosting & uploads |
| **Multer** | File upload handling (memory storage) |
| **Vercel** | Deployment configuration |

---

## Project Structure

```
├── config/               # Configuration files (DB, Cloudinary)
├── controllers/          # Route handlers (Products, Orders, Auth, etc.)
├── middlewares/          # Express middleware (Auth, Uploads)
├── models/               # Mongoose schemas (User, Product, Cart, etc.)
├── routes/               # API route definitions
├── scripts/              # Utility scripts (seed data, make admin)
├── types/                # TypeScript type declarations
├── server.ts             # Application entry point
└── vercel.json           # Vercel deployment config
```

---

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    
    # Cloudinary
    CLOUDINARY_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    
    # Clerk
    CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    
    # Seeding
    ADMIN_EMAIL=admin@example.com
    ```

4.  **Run the development server:**
    ```bash
    npm run server
    ```
    The server will start at `http://localhost:3000`.

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run server` | Start development server with **nodemon** & **tsx** |
| `npm start` | Start production server with **tsx** |
| `npm run build` | Compile TypeScript to JavaScript in `dist/` |

---

## API Documentation

### Authentication

All protected routes require a valid Clerk session token sent in the `Authorization` header as a Bearer token.

```
Authorization: Bearer <clerk_session_token>
```

### Roles

- `user` — Standard customer role.
- `admin` — Full access to product management, all orders, and dashboard stats.

---

### Base URL

Production/Deployed: `https://your-domain.vercel.app/api/v1`
Local: `http://localhost:3000/api/v1`

---

### Endpoints

#### Products (`/api/v1/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Get all products (with optional filtering/pagination) |
| `GET` | `/:id` | Public | Get a single product by ID |
| `POST` | `/` | Admin Only | Create a new product (supports up to 5 images) |
| `PUT` | `/:id` | Admin Only | Update a product by ID |
| `DELETE` | `/:id` | Admin Only | Delete a product by ID |

#### Cart (`/api/v1/cart`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | Get the current user's cart |
| `POST` | `/add` | Authenticated | Add an item to the cart |
| `PUT` | `/item/:productId` | Authenticated | Update quantity of a specific cart item |
| `DELETE` | `/item/:productId` | Authenticated | Remove a specific item from the cart |
| `DELETE` | `/` | Authenticated | Clear the entire cart |

#### Orders (`/api/v1/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | Get all orders for the logged-in user |
| `GET` | `/:id` | Authenticated | Get details of a specific user order |
| `POST` | `/` | Authenticated | Create a new order |
| `PUT` | `/:id/status` | Admin Only | Update the status of an order |
| `GET` | `/admin/all` | Admin Only | Get all orders (admin view) |

#### Addresses (`/api/v1/addresses`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | Get all addresses for the logged-in user |
| `POST` | `/` | Authenticated | Add a new address |
| `PUT` | `/:id` | Authenticated | Update an existing address |
| `DELETE` | `/:id` | Authenticated | Delete an address |

#### Wishlist (`/api/v1/wishlist`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Authenticated | Add a product to the wishlist |
| `GET` | `/` | Authenticated | Get the current user's wishlist |
| `DELETE` | `/:productId` | Authenticated | Remove a product from the wishlist |

#### Admin (`/api/v1/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats` | Admin Only | Get dashboard statistics |

#### Webhooks (`/api`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/clerk` | Clerk Signature | Handles Clerk user events (webhook) |

---

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | No | Server port (default: `3000`) |
| `MONGODB_URI` | Yes | MongoDB Atlas or local connection string |
| `CLOUDINARY_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (for backend) |
| `ADMIN_EMAIL` | Yes | Email used to assign the initial admin role during seeding |

---

## Deployment

This project is pre-configured for deployment to **Vercel** via `vercel.json`.

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Ensure all environment variables listed above are configured in your Vercel project dashboard under **Settings > Environment Variables**.

---

## License

ISC

