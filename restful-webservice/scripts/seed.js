// rest-api/scripts/seed.js
require("dotenv").config();
const { connect } = require("../config/db");
const Product = require("../models/product");

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }
  await connect(process.env.MONGODB_URI);

  const items = [
    {
      name: "Red T-shirt",
      description: "100% cotton",
      price: 19.99,
      inStock: true,
    },
    { name: "Blue Jeans", description: "Denim", price: 49.99, inStock: true },
    {
      name: "Black Hat",
      description: "Stylish cap",
      price: 14.5,
      inStock: false,
    },
  ];

  await Product.deleteMany({});
  const inserted = await Product.insertMany(items);
  console.log(`Seeded ${inserted.length} products`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
