# Blog List App

A RESTful backend API for managing blog posts with user authentication, built with Node.js, Express, and MongoDB.

## Features

- Create, read, and delete blog posts
- User registration and login with JWT authentication
- Token-based authorization — only the blog's creator can delete it
- Blog entries associated with user accounts
- Middleware for token extraction and user resolution

## Tech Stack

- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JSON Web Tokens (JWT)** for authentication
- **bcryptjs** for password hashing (used instead of `bcrypt` for cross-platform compatibility — `bcrypt` has known issues on Windows)
- Node.js built-in **test runner** for testing
- **Supertest** for HTTP integration tests

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/timgrindall/blog-list-app.git
cd blog-list-app
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
TEST_MONGODB_URI=your_test_mongodb_connection_string
SECRET=your_jwt_secret
PORT=3003
```

### Running the App

```bash
# Development
npm run dev

# Production
npm start
```

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login and receive a JWT token |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Register a new user |
| GET | `/api/users` | Get all users |

### Blogs

All write operations require a `Bearer` token in the `Authorization` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all blogs |
| POST | `/api/blogs` | Create a new blog post |
| DELETE | `/api/blogs/:id` | Delete a blog (creator only) |

## Authentication

Login returns a JWT token:

```bash
curl -X POST http://localhost:3003/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "youruser", "password": "yourpassword"}'
```

Use the token in subsequent requests:

```bash
curl -X POST http://localhost:3003/api/blogs \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Post", "author": "Me", "url": "http://example.com", "likes": 0}'
```

## Running Tests

```bash
node --test --test-only
```

Tests use a separate test database defined by `TEST_MONGODB_URI`.
