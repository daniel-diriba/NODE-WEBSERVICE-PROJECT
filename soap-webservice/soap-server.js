require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const soap = require("soap");
const mongoose = require("mongoose");

// Load Product model
const Product = require("./models/product");

// WSDL path
const WSDL_PATH = path.join(__dirname, "product.wsdl");
const wsdl = fs.readFileSync(WSDL_PATH, "utf8");

// SOAP service implementation
const service = {
  ProductService: {
    ProductPort: {
      async CreateProduct(args) {
        try {
          const product = new Product({
            name: args.name,
            description: args.description || "",
            price: Number(args.price),
            inStock: args.inStock === "true" || args.inStock === true,
          });
          const saved = await product.save();
          return { id: saved._id.toString() };
        } catch (err) {
          console.error(err);
          return { id: "" };
        }
      },

      async GetProduct(args) {
        try {
          const doc = await Product.findById(args.id).lean();
          if (!doc) return {};
          return {
            id: doc._id.toString(),
            name: doc.name,
            description: doc.description || "",
            price: doc.price,
            inStock: !!doc.inStock,
          };
        } catch (err) {
          console.error(err);
          return {};
        }
      },

      async GetAllProducts() {
        try {
          const docs = await Product.find().lean();
          return {
            products: {
              product: docs.map((d) => ({
                id: d._id.toString(),
                name: d.name,
                description: d.description || "",
                price: d.price,
                inStock: !!d.inStock,
              })),
            },
          };
        } catch (err) {
          console.error(err);
          return { products: { product: [] } };
        }
      },

      async UpdateProduct(args) {
        try {
          const update = {};
          if (args.name) update.name = args.name;
          if (args.description) update.description = args.description;
          if (args.price !== undefined) update.price = Number(args.price);
          if (args.inStock !== undefined)
            update.inStock = args.inStock === "true" || args.inStock === true;

          const res = await Product.findByIdAndUpdate(args.id, update, {
            new: true,
          });
          return { success: !!res };
        } catch (err) {
          console.error(err);
          return { success: false };
        }
      },

      async DeleteProduct(args) {
        try {
          const res = await Product.findByIdAndDelete(args.id);
          return { success: !!res };
        } catch (err) {
          console.error(err);
          return { success: false };
        }
      },
    },
  },
};

async function start() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const SOAP_PORT = process.env.SOAP_PORT || 8001;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI missing in .env");
    process.exit(1);
  }

  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB Atlas");

  const server = http.createServer((req, res) => {
    res.end("SOAP: Product service (see ?wsdl)");
  });

  server.listen(SOAP_PORT, () => {
    soap.listen(server, "/product", service, wsdl);
    console.log(
      `SOAP service running at http://localhost:${SOAP_PORT}/product?wsdl`
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${SOAP_PORT} already in use. Kill the process or change SOAP_PORT in .env`
      );
      process.exit(1);
    }
    throw err;
  });
}

start().catch(console.error);
