const client = require("prom-client");

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCount = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequestCount);

function metricsMiddleware(req, res, next) {
  res.on("finish", () => {
    const route = req.route?.path || req.path || "unknown";
    httpRequestCount.inc({
      method: req.method,
      route,
      status: String(res.statusCode)
    });
  });
  next();
}

module.exports = { register, metricsMiddleware };
