import mongoose from "mongoose";

let isConnect = false;

const dbURL = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    if (isConnect) {
      return mongoose.connection;
    }
    if (!dbURL) {
      throw new Error(`Losting environment variable MONGODB_URI ${dbURL}`);
    }
    console.log("Establishing connection to MongoDB...");
    await mongoose.connect(dbURL);
    isConnect = true;
    console.log("Connection established successfully");
    return mongoose.connection;
  } catch (err) {
    throw err;
  }
};

export default connectDB;
