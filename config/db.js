const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`mongoDB connected: ${conn.connection.host}`);
    console.log(`database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`mongoDB connection err: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
