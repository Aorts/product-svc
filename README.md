# Express + TypeScript (Hexagonal) — Product Service

Minimal, pragmatic starter for a clean Hexagonal (Ports & Adapters) API using **Express + TypeScript + Mongoose**.

## Features

- Hexagonal structure: **domain / application / repository**
- MongoDB via **Mongoose** (ObjectId `_id`)
- Standard JSON response wrapper
- Request logging with **X-Correlation-ID**
- Sort by `price`, `name` or `updatedAt` on listing endpoint
- **OpenAPI** docs at `/docs` and `/openapi.json`

## Project Structure

```
src/
  ├── api-docs/                # OpenAPI documentation router and schemas
  │── infrastructure/db/       # Infrastructure (db connection)
  ├── internal/
  │   ├── api/                 # Express middlewares
  │   │   └── middleware/      # Middleware functions
  │   │   └── routes           # API routes
  │   ├── application/         # Application layer (controllers)
  │   ├── core/                # Core domain ports and services
  │   └── repository/          # Repository implementations
  ├── config/                  # Configuration management
  ├── utility/                 # Utility functions and types
  │   └── logger.ts            # Logger utility
  │   └── error.ts             # Custom error class
  │   └── response.ts          # Standard response wrapper
  └── server.ts                # Application entry point
```

## Quick Start

```bash
docker-compose up -d   # start mongo

# install
pnpm install   # or: npm ci

# dev
pnpm dev       # runs src/server.ts with tsx

# build & run
pnpm build     # tsc && tsc-alias
pnpm start     # node dist/server.js
```

## ENV

Create .env (or set env vars):

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/productsdb
```

## API Endpoints

- `POST /products` - Create product
- `GET /products` - List products (with pagination and sorting)
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product by ID
- `DELETE /products/:id` - Delete product by ID
- `GET /docs` - OpenAPI documentation UI

## Testing the API

Use curl or Postman to test the API endpoints. Example to create a product:

```bash
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Sample Product",
  "price": 19.99,
  "description": "This is a sample product.",
  "stock_quantity": 100
}'
```

## OpenAPI Documentation

Access the OpenAPI documentation at `http://localhost:3000/docs` after starting the server.
