# Santander Test - Fullstack Project

This project is a fullstack application featuring an Angular frontend, a NestJS backend connected a MySQL Data Base, and automated deployment using Docker and Nginx, currently hosted on **Railway**.

## 🚀 Technologies Used

### Frontend

- **Angular 21**: Main framework.
- **Angular Material**: UI component library for a modern and responsive design.
- **Nginx**: Web server used to serve the static frontend files.

### Backend

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: ORM for database interaction.
- **Jest**: Testing framework for unit testing and code quality assurance.

### DevOps & Deployment

- **Docker**: Containerization of the entire application.
- **Nginx**: Acts as a reverse proxy to route requests to the backend and serve the frontend.
- **Railway**: Cloud platform used for hosting and deployment.
- **Bash Script**: `start.sh` to manage the simultaneous startup of services within the container.

---

## 📋 Prerequisites

Before begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 20 or higher recommended)
- [Docker](https://www.docker.com/) It's not necessary, but Docker is used to deploy the application to production.

---

## 🛠️ Installation and Local Configuration

### 1. Clone the repository

```bash
git clone <repository-url>
cd SantanderTest
```

### 2. Configure the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Configure the Frontend

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🧪 Testing

The backend includes automated tests using **Jest**.

- **Run all tests:**
  ```bash
  cd backend
  npm run test
  ```

---

### Railway Deployment

The application is deployed on **Railway** using the provided `Dockerfile`. Railway automatically detects the Dockerfile and builds the image from git branch **production**.

The URL to access the project is: [https://santander-test-are.up.railway.app/](https://santander-test-are.up.railway.app/)

### Nginx Configuration:

Nginx is configured to:

- Serve static frontend files on port `80`.
- Act as a reverse proxy for all requests starting with `/api/`, forwarding them to the NestJS backend (port `3000`).
- Handle Angular routing (Single Page Application) by redirecting unknown routes to `index.html`.

---

## 📂 Project Structure

- `/frontend`: Angular application with Material components.
- `/backend`: REST API built with NestJS.
- `nginx.conf`: Custom Nginx server configuration.
- `Dockerfile`: Multi-stage configuration to optimize the final image.
- `start.sh`: Startup script to launch both the backend and Nginx.
