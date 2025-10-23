const mongoose = require("mongoose");

async function connect(uri) {
  if (!uri) throw new Error("MONGODB_URI not provided");

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ REST: Connected to MongoDB Atlas");

    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    // Close connection on app termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ REST: MongoDB connection failed", err);
    throw err;
  }
}

module.exports = { connect, mongoose };
