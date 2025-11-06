# Prometheus Monitoring App

A complete Node.js + Prometheus + Grafana monitoring setup on Kubernetes.

## 🚀 Overview
This project demonstrates how to:
- Deploy a Node.js web app in Kubernetes.
- Expose custom Prometheus metrics.
- Collect and visualize metrics with Prometheus & Grafana.
- Set up alerting with Alertmanager (email & Slack).

---

## 🏗 Project Structure
| Folder/File | Description |
|--------------|-------------|
| `my-node-app/` | Node.js application exposing `/metrics` endpoint |
| `k8s/` | Kubernetes manifests for app, ServiceMonitor, Alerts, and Alertmanager |
| `docs/` | Setup and architecture documentation |

---

## ⚙️ Setup Steps

### 1️⃣ Build & Push Docker Image
```bash
cd my-node-app
docker build -t <your-dockerhub-user>/my-node-app:latest .
docker push <your-dockerhub-user>/my-node-app:latest

