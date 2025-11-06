# 📘 Deploy Prometheus using Helm

This guide explains how to install Prometheus on a Kubernetes cluster using the official Helm chart.

---

## 🧩 Prerequisites

Before you begin, make sure you have:

- A running Kubernetes cluster (e.g., Minikube, kind, or cloud-based)
- `kubectl` installed and configured to access your cluster
- Helm (version 3 or higher) installed

---

## ⚙️ 1. Install Helm (if not already installed)

Run the following command to install Helm:

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verify the installation:

```bash
helm version
```

## 📦 2. Add the Prometheus Helm repository

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```


## 🚀 3. Install Prometheus

- Create a dedicated namespace for Prometheus:

```bash
kubectl create namespace monitoring
```

- Then install Prometheus using Helm:

```bash
helm install prometheus prometheus-community/prometheus --namespace monitoring
```

## 🔍 4. Check the status of the pods

```bash
kubectl get pods -n monitoring
```

- You should see multiple Prometheus components running, such as:

```pgsql
prometheus-server-xxxx
prometheus-alertmanager-xxxx
prometheus-node-exporter-xxxx
```

## 🌐 5. Access the Prometheus dashboard

- To access the Prometheus UI , Grafana Ui , Alertmanager Ui:

>> you can expose the svc of prometheus ,grafana and alertmanager to a nodeport service to access it

```bash
kubectl expose service prometheus --name=prometheus-nodeport --type=NodePort --port=9090 --target-port=9090 --namespace=monitoring
kubectl expose service alertmanager --name=alertmanager-nodeport --type=NodePort --port=9093 --target-port=9093 --namespace=monitoring
kubectl expose service prometheus --name=grafana-nodeport --type=NodePort --port=3000 --target-port=3000 --namespace=monitoring
```

- you can check it from :

```bash
kubectl get svc -n monitoring
```

![]{}
---


- Now open your browser and navigate to:

```bash
http://public-ip:<nodeport-svc>
```
- prometheus:

![]{}
---

- Alertmanager:

![]{}
---

- Grafana:

![]{}
---

## ✍️ Author: Mohamed Magdy
### 📅 Last Updated: November 2025
