# Full-stack Todo Application

A modern, full-stack Todo application built with TypeScript, featuring a robust backend API and responsive frontend interface.

## 🛠 Tech Stack

### Backend

- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **Zod** for runtime validation
- **OpenAPI/Swagger** for API documentation
- **Pino** for logging
- **Express Rate Limit** for API protection
- **Helmet** for security headers
- **Docker** for containerization

### Frontend

- **Vite** for fast development and building
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Ky** for HTTP requests
- **Zod** for data validation

### Development Tools

- **pnpm** for package management
- **Biome** for linting and formatting
- **Docker Compose** for local development
- **Husky** for git hooks

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm
- Docker and Docker Compose (optional)

### Running with Docker (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/www-project-2.git

cd www-project-2
```

2. Start the application using Docker Compose:

```bash
docker compose up
```

The application will be available at:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:8080>
- API Documentation: <http://localhost:8080/swagger>

### Running Locally

1. Install dependencies in root, frontend, and backend directories:

```bash
pnpm install
```

2. Start the backend:

```bash
cd backend
pnpm dev
```

3. In a new terminal, start the frontend:

```bash
cd frontend
pnpm dev
```

## 📝 API Documentation

The API documentation is automatically generated using OpenAPI/Swagger and is available at `http://localhost:8080/swagger` when running the application.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
