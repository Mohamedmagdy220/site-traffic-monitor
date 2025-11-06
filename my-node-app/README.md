# 🟢 My Node App — Monitoring Service

This is a simple **Node.js web application** that exposes custom metrics for Prometheus scraping.  
It’s designed as part of a monitoring system to track traffic, performance, and uptime.

---

## 🚀 Overview

The app provides:
- A basic HTTP server built with Node.js `http` module
- A `/metrics` endpoint using `prom-client` for Prometheus scraping
- A styled HTML landing page for visitors
- Default and custom metrics (`hello_visitors_total`, `http_request_duration_seconds`)
- Ready for Docker and Kubernetes deployment

---

## ⚙️ Requirements

- Node.js **v18+**
- Docker (for building the image)
- Prometheus (for collecting metrics)

---

## 🐳 Docker Setup
 
### 1️⃣ Build the Docker image

```bash
docker build -t my-node-app:latest .
```

### 2️⃣ Run the container

```bash
docker run -d -p 3000:3000 my-node-app
```

### 3️⃣ Test endpoints

```bash
http://localhost:3000 → "Hello Visitors" page
```

```bash
http://localhost:3000/metrics → Prometheus metrics
```
### Build & Push Docker Image

When deploying to Kubernetes, you need the image hosted on a registry (e.g., Docker Hub).

#### Step 1 — Login to Docker Hub
```bash
docker login
```
Enter your Docker Hub username and password (or token).

#### Step 2 — Tag the image

Replace <your-username> with your Docker Hub username.

```bash
docker tag my-node-app:latest <your-username>/my-node-app:latest
```

#### Step 3 — Push the image

```bash
docker push <your-username>/my-node-app:latest
```

#### Example:

```bash
docker tag my-node-app:latest mohamedmagdy/welcome-app:latest
docker push mohamedmagdy/welcome-app:latest
```

#### Step 4 — Verify on Docker Hub

![image][]


## 🧠 Notes

- Default metrics include CPU, memory, event loop lag, etc. (via prom-client)

- Custom metrics:

    - hello_visitors_total: total visitors to the web page

    - http_request_duration_seconds: request duration histogram

- You can integrate this app with Prometheus by pointing a ServiceMonitor to port 3000.
