const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const client = require('prom-client');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const ALL_NODES = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
];
const myUrl = `http://localhost:${PORT}`;
const NODES = ALL_NODES.filter(nodeUrl => nodeUrl !== myUrl);

// Prometheus client setup
const register = new client.Registry();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'node'],
});
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code', 'node'],
  buckets: [50, 100, 300, 500, 1000, 2000, 5000],
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDurationMs);
client.collectDefaultMetrics({ register });

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', node: PORT, timestamp: new Date().toISOString() });
});

app.post('/task', async (req, res) => {
  const requestId = uuidv4();
  const { taskData } = req.body;
  const route = '/task';

  console.log(`[${new Date().toISOString()}] [${requestId}] Node ${PORT} received task:`, taskData);

  const end = httpRequestDurationMs.startTimer();

  try {
    const results = await Promise.all(
      NODES.map(nodeUrl =>
        axios.post(`${nodeUrl}/subtask`, { subtaskData: taskData + '-part', requestId }, { timeout: 5000 })
          .then(response => response.data)
          .catch(err => {
            console.error(`[${new Date().toISOString()}] [${requestId}] Error from ${nodeUrl}:`, err.message);
            return { error: err.message };
          })
      )
    );

    console.log(`[${new Date().toISOString()}] [${requestId}] Node ${PORT} aggregated results:`, results);

    httpRequestCounter.inc({ method: 'POST', route, status_code: 200, node: String(PORT) });
    end({ method: 'POST', route, status_code: 200, node: String(PORT) });

    res.json({
      requestId,
      node: PORT,
      aggregatedResults: results
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [${requestId}] Failed to distribute subtasks:`, error.message);

    httpRequestCounter.inc({ method: 'POST', route, status_code: 500, node: String(PORT) });
    end({ method: 'POST', route, status_code: 500, node: String(PORT) });

    res.status(500).json({ error: 'Failed to distribute subtasks', requestId });
  }
});

app.post('/subtask', (req, res) => {
  const { subtaskData, requestId } = req.body;
  const route = '/subtask';

  console.log(`[${new Date().toISOString()}] [${requestId}] Node ${PORT} processing subtask:`, subtaskData);

  const end = httpRequestDurationMs.startTimer();

  // Simulate subtask processing
  const processed = subtaskData.toUpperCase();

  httpRequestCounter.inc({ method: 'POST', route, status_code: 200, node: String(PORT) });
  end({ method: 'POST', route, status_code: 200, node: String(PORT) });

  res.json({ processed, requestId });
});

app.listen(PORT, () => {
  console.log(`Node running on port ${PORT}`);
});
