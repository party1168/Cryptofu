import mongoose, { Schema } from "mongoose";
import { IUser } from "@/interfaces/models";
/**
 * 使用者 Schema 定義。
 * @const {Schema} UserSchema
 * @property {string} uuid - 使用者的唯一識別碼，必填且唯一。
 * @property {string} name - 使用者名稱，必填，長度介於 8 到 24 字元之間。
 * @property {string} email - 使用者電子郵件，必填且唯一。
 * @property {string} password - 使用者密碼，必填。
 * @property {string} salt - 密碼鹽值，必填。
 * @property {string} role - 使用者角色，必填，預設為 "general"。
 */
const UserSchema: Schema = new Schema({
  uuid: {
    type: String,
    required: true,
    index: { unique: true },
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    maxLength: 24,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["general", "advance", "admin"],
    default: "general",
  },
});

/**
 * 使用者模型，如果已存在則使用現有模型，否則創建新模型。
 * @const {Model<IUser>} User
 */
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
