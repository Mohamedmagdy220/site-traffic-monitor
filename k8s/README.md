# 🚀 Kubernetes Monitoring Stack — Node.js + Prometheus + Alertmanager

This folder contains all Kubernetes manifests required to deploy and monitor the **Node.js monitoring app** using **Prometheus**, **Alertmanager**, and **Grafana**.
## Overview 

It includes the full setup for:
- Deploying the Node.js app  
- Exposing it via a Kubernetes Service  
- Collecting metrics with Prometheus  
- Sending alerts (Slack + Gmail)  
- Visualizing metrics in Grafana  

---

## 📁 Folder Structure

| File | Description |
|------|--------------|
| `app-deployment.yml`      | Deploys the Node.js app (3 replicas) |
| `app-service.yml`         | Exposes the app inside/outside the cluster |
| `app-servicemonitor.yml`  | Tells Prometheus where to scrape metrics |
| `app-rules.yml`           | Prometheus alerting rules |
| `alert-manager.yml`       | Slack Alertmanager configuration |
| `alertmanager-email.yml`  | Email Alertmanager configuration |
| `slack-secret.yml`        | Stores Slack webhook securely |

---

## ⚙️ Prerequisites

- Working Kubernetes cluster  
- `kubectl` and `helm` installed  
- Docker image built & pushed to Docker Hub  
- Prometheus + Grafana installed via Helm  

### Install Prometheus + Grafana

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring
```

## Steps

### 🧱 Step 1: Deploy the Node.js App

Deployment

Creates 3 replicas using your image mohamed2200/welcome-app:v1.

```bash
kubectl apply -f app-deployment.yml
kubectl get pods
```

Service

Exposes the app through a NodePort and names the port nodejs.

```bash
kubectl apply -f app-service.yml
kubectl get svc
```

Access

```bash
Visit http://<public ip>:<svc port>
```

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/app.png)
---


### 📡 Step 2: Connect to Prometheus (ServiceMonitor)
app-servicemonitor.yml defines where Prometheus should scrape metrics.

- Namespace: monitoring
- Path: /metrics
- Port name: nodejs
- Selector: app: welcome-app


Apply:
```bash
kubectl apply -f app-servicemonitor.yml
```

Check in Prometheus:
```bash
kubectl get svc -n monitoring 
kubectl expose service monitoring-kube-prometheus-prometheus --name=monitoring-kube-prometheus-prometheus-ext --type=NodePort --port=9090 --target-port=9090 --namespace=monitoring
http://<public ip >:<svc port>  → Status → Targets
```
![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/target%20in%20prometheus.png)
---

### ⚠️ Step 3: Prometheus Rules (Alerts)


app-rules.yml adds alert logic.
Example: HighVisitorRate triggers if >20 requests per 5 min.

```bash
kubectl apply -f app-rules.yml
```

Check:
```bash
kubectl get svc -n monitoring
kubectl expose service monitoring-kube-prometheus-prometheus --name=monitoring-kube-prometheus-prometheus-ext --type=NodePort --port=9090 --target-port=9090 --namespace=monitoring
http://<public ip >:<prometheus-svc-port>/alerts
```
![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/start-prometheus.png)
---

### 📬 Step 4: Alertmanager — Slack + Gmail

#### Slack Setup

Create secret:
```bash
kubectl -n monitoring create secret generic slack-secret \
  --from-literal=webhook='https://hooks.slack.com/services/XXX/YYY/ZZZ'  <-- your webhook from slack
```
Apply config:
```bash
kubectl apply -f alert-manager.yml
```

#### Gmail Setup

- Generate an App Password in Google Account → Security → App Passwords.

Create secret:
```bash 
kubectl -n monitoring create secret generic gmail-secret \
  --from-literal=password='YOUR_APP_PASSWORD'
```

Apply config:
```bash
kubectl apply -f alertmanager-email.yml
```

Check UI:

```bash
kubectl get svc -n monitoring
kubectl expose service monitoring-kube-prometheus-alertmanager --name=monitoring-kube-prometheus-alertmanager-ext --type=NodePort --port=9093 --target-port=9093 --namespace=monitoring
http://<public ip>:<alertmanager-svc-port>
```

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/start-alertmanager.png)
---

### 📊 Step 5: Grafana Dashboard

```bash
kubectl get svc -n monitoring
kubectl expose service monitoring-grafana --name=monitoring-grafana-ext --type=NodePort> --port=3000 --target-port=3000 --namespace=monitoring
http://<public ip>:<grafana-svc-port>
```

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/grafana.png)
---


- Default credentials:

```bash
user: admin          password: prom-operator
```

- check alert-rules on prometheus:
![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/Alerts%20in%20Prometheus.png)
---

- check alert-rules on alertmanager:
![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/start-alertmanager.png)
---



### 🧪 Step 6: Trigger a Test Alert

#### first: check the status of pods if it will be down

- you can stop 3 pods for check

```bash
kubectl scale deployment welcome-app-deployment --replicas=0
```

- after 1 minute prometheus will notice that pods are down 

- you will see it bending for 1 minute in alerts at prometheus 

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/node-down-pending.png)
---

- after that you will see this alert become firing like that 

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/firing-node-down-prometheus.png)
---

- and you can see it in alert manger ui 

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/node-down-in%20-alertmanager.png)
---

- Gmail → Alert email

- and alertmanager will send a message at email for firing like that 

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/firing-node-down-at-gmail.png)
---
- you can running pods now and you should see another message on your mail like that

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/resolved-at-gmail.png)
---

#### second: check higher visitor rate alert 

```bash
for i in {1..200}; do curl -s http://localhost:3000/ > /dev/null; done
```
Then check:

- Prometheus → Alerts

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/high%20vistor%20rate%20command.png)
---

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/firing%20alert%20(high%20visitor%20rate).png)
---
- Slack → Alert message
>> you will get allert message at channel at slack


### For Grafana i made a dashboard for this app

- you can see it here 

![](https://github.com/Mohamedmagdy220/site-traffic-monitor/blob/main/images/custom-dashboard.png)
---




