# Snippeter Backend

This is the backend service for the Snippeter application. It provides RESTful APIs for managing code snippets, user authentication, and other backend functionalities.

## Features

- User authentication (login, registration)
- CRUD operations for code snippets
- Secure environment with environment variable support
- Modular and scalable codebase

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd snippeter-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and update the values as needed.

4. **Run the server:**
   ```bash
   npm start
   # or
   yarn start
   ```

## Development

- To start the server in development mode with auto-reload:
  ```bash
  npm run dev
  # or
  yarn dev
  ```

## Folder Structure

- `src/` - Source code
- `routes/` - API route handlers
- `models/` - Database models
- `controllers/` - Business logic
- `middlewares/` - Express middlewares

## API Documentation

API documentation is available via [Swagger](https://swagger.io/) or Postman collection (if provided).

## License

This project is licensed under the MIT License.
