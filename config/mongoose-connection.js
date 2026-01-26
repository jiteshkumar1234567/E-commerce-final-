const mongoose = require("mongoose");

// Optional: faster fail if Atlas unreachable
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Atlas Connected");
  } catch (err) {
    console.error("❌ MongoDB Atlas connection failed:", err.message);
    process.exit(1); // stop app if Atlas fails
  }
};

// Initial connect
connectDB();

/* =========================
   CONNECTION EVENT HANDLERS
   ========================= */

mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected to Atlas");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔴 Mongoose disconnected from Atlas");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔻 MongoDB Atlas connection closed");
  process.exit(0);
});

module.exports = mongoose.connection;
