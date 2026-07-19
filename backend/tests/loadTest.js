const http = require("http");

const TARGET_HOST = "localhost";
const TARGET_PORT = 3000;
const TARGET_PATH = "/auth/logout"; // Raw route without DB query bottleneck to measure Express overhead
const CONCURRENCY = 50;            // Number of concurrent connections
const TOTAL_REQUESTS = 1000;       // Total requests to complete

let completedRequests = 0;
let failedRequests = 0;
let activeRequests = 0;
const latencies = [];
const startTime = Date.now();

function sendRequest() {
  if (completedRequests + failedRequests >= TOTAL_REQUESTS) {
    if (activeRequests === 0) {
      printReport();
    }
    return;
  }

  activeRequests++;
  const requestStart = Date.now();

  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: TARGET_PATH,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      const latency = Date.now() - requestStart;
      latencies.push(latency);

      if (res.statusCode === 200) {
        completedRequests++;
      } else {
        failedRequests++;
      }

      activeRequests--;
      sendRequest(); // Schedule next request
    });
  });

  req.on("error", (e) => {
    failedRequests++;
    activeRequests--;
    sendRequest();
  });

  req.end();
}

function printReport() {
  const totalTimeMs = Date.now() - startTime;
  const totalTimeSec = totalTimeMs / 1000;
  const rps = (completedRequests + failedRequests) / totalTimeSec;
  
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  console.log("\n==========================================");
  console.log("📊 LOAD TEST REPORT (Express Node.js Server)");
  console.log("==========================================");
  console.log(`URL:            http://${TARGET_HOST}:${TARGET_PORT}${TARGET_PATH}`);
  console.log(`Concurrency:    ${CONCURRENCY} concurrent workers`);
  console.log(`Total Requests: ${TOTAL_REQUESTS}`);
  console.log("------------------------------------------");
  console.log(`Success Rate:   ${completedRequests} OK / ${failedRequests} Failed`);
  console.log(`Duration:       ${totalTimeSec.toFixed(2)} seconds`);
  console.log(`Throughput:     ${rps.toFixed(2)} req/sec (RPS)`);
  console.log("------------------------------------------");
  console.log("Latency Stats:");
  console.log(`  Average:      ${avgLatency.toFixed(2)} ms`);
  console.log(`  50th% (Median):${p50} ms`);
  console.log(`  95th%:        ${p95} ms`);
  console.log(`  99th%:        ${p99} ms`);
  console.log("==========================================\n");
}

console.log(`Starting load test: ${TOTAL_REQUESTS} requests at concurrency of ${CONCURRENCY}...\n`);

// Boot up concurrent workers
for (let i = 0; i < CONCURRENCY; i++) {
  sendRequest();
}
