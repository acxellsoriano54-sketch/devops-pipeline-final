const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { initDb } = require("./db");
const { buildRouter } = require("./routes");
const { register, metricsMiddleware } = require("./metrics");

const PORT = process.env.PORT || 3000;

initDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(metricsMiddleware);

const frontendPath = path.join(__dirname, "..", "..", "frontend");
app.use("/", express.static(frontendPath));

const { router } = buildRouter();
app.use(router);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
