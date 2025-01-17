import mongoose from "mongoose";
import User from "@/models/User";
let isConnect = false;

const dbURL = process.env.MONGODB_URI;

/**
 * 連接到 MongoDB 資料庫的異步函數。
 * 
 * @returns {Promise<mongoose.Connection>} 返回 mongoose 的連接實例。
 * @throws {Error} 如果環境變數 MONGODB_URI 未設置或連接失敗，則拋出錯誤。
 * 
 * @example
 * ```typescript
 * import { connectDB } from './lib/db';
 * 
 * (async () => {
 *   try {
 *     const connection = await connectDB();
 *     console.log('MongoDB 連接成功');
 *   } catch (error) {
 *     console.error('MongoDB 連接失敗', error);
 *   }
 * })();
 * ```
 */
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
    await User.createIndexes();
    isConnect = true;
    console.log("Connection established successfully");
    return mongoose.connection;
  } catch (err) {
    throw err;
  }
};

export default connectDB;
