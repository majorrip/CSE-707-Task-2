Here’s a clean and professional **`README.md`** for your distributed Node.js system:

---

# 🌐 Distributed Node.js System

This project demonstrates a simple distributed system built using **Node.js** and **Express**, where nodes communicate with each other to process tasks. It also includes **metrics tracking** using Prometheus for analytics.

---

## 🚀 Features

✅ Accepts tasks at any node and distributes subtasks to other nodes
✅ Unique request tracing with UUIDs for debugging and tracking
✅ Health check endpoint for node status monitoring
✅ Exposes Prometheus-compatible metrics for analytics
✅ Graceful error handling if a node is unavailable

---

## 🛠 Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [npm](https://www.npmjs.com/)
* (Optional for analytics dashboards) [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/)

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/distributed-nodejs-system.git
   cd distributed-nodejs-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

---

## ▶️ Running the System

This system uses 3 nodes running on different ports.

### Start each node in a separate terminal:

```powershell
# Node 1
$env:PORT=3000
node server.js

# Node 2
$env:PORT=3001
node server.js

# Node 3
$env:PORT=3002
node server.js
```

---

## 📡 API Endpoints

### **POST `/task`**

Distributes a task to other nodes for subtask processing.

* **URL:** `http://localhost:3000/task`
* **Method:** POST
* **Body (JSON):**

  ```json
  {
    "taskData": "hello"
  }
  ```
* **Response:**

  ```json
  {
    "requestId": "123e4567-e89b-12d3-a456-426614174000",
    "node": 3000,
    "aggregatedResults": [
      { "processed": "HELLO-PART" },
      { "processed": "HELLO-PART" }
    ]
  }
  ```

---

### **GET `/health`**

Check if a node is running.

* **URL:** `http://localhost:3000/health`
* **Response:**

  ```json
  {
    "status": "OK",
    "node": 3000,
    "timestamp": "2025-07-23T10:00:00.000Z"
  }
  ```

---

### **GET `/metrics`**

Expose Prometheus metrics for monitoring.

* **URL:** `http://localhost:3000/metrics`
* **Response:** Prometheus-formatted metrics data.

---

## 📊 Analytics

Metrics exposed at `/metrics` include:

* Total HTTP requests
* Request durations (ms)
* Requests by route, method, and status code
* Node-level insights

To visualize these metrics:

1. Set up **Prometheus** to scrape the `/metrics` endpoints.
2. Use **Grafana** to create dashboards.

---

## 📖 Example Workflow

1. Start all 3 nodes on ports `3000`, `3001`, and `3002`.
2. Send a `POST` request to `http://localhost:3000/task` with `taskData`.
3. Watch logs in each node’s terminal to see distributed processing.
4. Visit `http://localhost:3000/metrics` to see analytics data.

---

## 🧑‍💻 Tech Stack

* **Node.js**
* **Express.js**
* **Axios** (HTTP requests)
* **UUID** (request tracing)
* **Prometheus Client (`prom-client`)**

---

## 📂 Project Structure

```
distributed-nodejs-system/
├── server.js        # Main server code
├── package.json     # Dependencies and scripts
└── README.md        # Project documentation
```

---

## 👩‍💻 Author

Atif Karim

