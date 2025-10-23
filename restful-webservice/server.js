// rest-api/server.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { connect } = require("./config/db");
const productsRouter = require("./routes/products");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    console.error(
      "MONGODB_URI missing – copy .env.example to .env and set your Atlas string"
    );
    process.exit(1);
  }
  await connect(MONGODB_URI);

  const app = express();
  app.use(morgan("dev"));
  app.use(express.json()); // parse JSON

  app.use("/api/products", productsRouter);

  app.get("/", (req, res) => res.send("REST API: Product service"));

  app.use((err, req, res, next) => {
    console.error("REST error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, () =>
    console.log(`REST API running at http://localhost:${PORT}/api/products`)
  );
}

main().catch((err) => {
  console.error("Failed to start REST API", err);
  process.exit(1);
});
