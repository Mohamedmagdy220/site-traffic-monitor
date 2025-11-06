<p align="center">
  <img src="./banner.png" alt="Hello Node App Monitoring Banner" width="100%">
</p>

<h1 align="center">📊 Hello Node App — Monitoring Stack</h1>

<p align="center">
  <b>Node.js • Docker • Kubernetes • Prometheus • Grafana</b><br>
  A complete monitoring setup for a Node.js web app running on Kubernetes, with Prometheus metrics, Alertmanager, and Grafana visualization.
</p>

---
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
```

### 2️⃣ Deploy the App & Prometheus Stack
```bash
# Install Prometheus & Grafana (if not already)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```


### 3️⃣ Apply App Manifests

```bash
kubectl apply -f k8s/
```

### 📈 Access Dashboards

- APP --> `http://<node-ip>:<port>`

- Grafana → `kubectl expose service monitoring-grafana --name=monitoring-grafana-ext --type=NodePort> --port=3000 --target-port=3000 --namespace=monitoring` 

- Default user: `admin`, pass: `prom-operator`

- Prometheus → `kubectl expose service monitoring-kube-prometheus-prometheus --name=monitoring-kube-prometheus-prometheus-ext --type=NodePort --port=9090 --target-port=9090 --namespace=monitoring`

- Alertmanager → `kubectl expose service monitoring-kube-prometheus-alertmanager --name=monitoring-kube-prometheus-alertmanager-ext --type=NodePort --port=9093 --target-port=9093 --namespace=monitoring`

### 🔔 Alerts

#### Configured for:

- High error rates

- App downtime

#### Alertmanager integrations:

- Email: via `alertmanager-email.yml`

- Slack: via `slack-secret.yml`


### grafana Dashboard

![]{}
---


