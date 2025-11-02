// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Remove deprecated options: useNewUrlParser and useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`🚀 mongoDB connected: ${conn.connection.host}`);
    console.log(`📄 database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ mongoDB connection err: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
