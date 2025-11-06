const http = require('http');
const url = require('url');
const client = require('prom-client');

const hostname = '0.0.0.0';
const port = 3000;

// سجل الـ default metrics (مثل CPU, Memory usage)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'hello_node_' });

// إنشاء custom metric — عدد الزيارات
const counter = new client.Counter({
  name: 'hello_visitors_total',
  help: 'Total number of visitors to the site',
});

// إنشاء histogram لقياس زمن الاستجابة
const responseTimeHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  buckets: [0.1, 0.3, 0.5, 1, 3, 5],
});

const server = http.createServer(async (req, res) => {
  const start = Date.now();
  const path = url.parse(req.url).pathname;

  if (path === '/metrics') {
    // endpoint خاص بـ Prometheus
    res.setHeader('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } else {
    counter.inc(); // زيادة العداد
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hello Visitors</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            font-family: 'Poppins', sans-serif;
          }
          h1 {
            background: #fff;
            color: #333;
            padding: 20px 40px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-size: 2.5rem;
          }
        </style>
      </head>
      <body>
        <h1>Hello Visitors 👋</h1>
      </body>
      </html>
    `);
  }

  const duration = (Date.now() - start) / 1000;
  responseTimeHistogram.observe(duration);
});

server.listen(port, hostname, () => {
  console.log(`✅ Server running at http://${hostname}:${port}/`);
});
