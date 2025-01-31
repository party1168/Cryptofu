import mongoose, { Schema, Document } from "mongoose";
/**
 * 使用者介面，繼承自 mongoose 的 Document。
 * @interface IUser
 * @property {string} uuid - 使用者的唯一識別碼。
 * @property {string} name - 使用者名稱。
 * @property {string} email - 使用者電子郵件。
 * @property {string} password - 使用者密碼。
 * @property {string} salt - 密碼鹽值。
 * @property {Array<string>} wallet - 使用者的錢包地址。
 * @property {Array<string>} exchange - 使用者的交易所。
 * @property {string} role - 使用者角色。
 */

export interface IUser extends Document {
  uuid: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  wallet: Array<IWallet>;
  exchange: Array<IExchange>;
  role: string;
}
/**
 * 錢包介面，繼承自 mongoose 的 Document。
 * @interface IWallet
 * @property {string} name - 錢包名稱。
 * @property {string} address - 錢包地址。
 */
export interface IWallet extends Document {
  name: string;
  address: string;
}

export interface IExchange extends Document {
  name: string;
  APIkey: string;
  APIsecret: string;
}

/**
 * 錢包 Schema 定義。
 * @const {Schema} WalletSchema
 * @property {string} name - 錢包名稱，必填。
 * @property {string} address - 錢包地址，必填。
 */

const WalletSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
});

const ExchangeSchema: Schema = new Schema({
  name: { type: String, required: true },
  APIkey: { type: String, required: true },
  APIsecret: { type: String, required: true }
});

/**
 * 使用者 Schema 定義。
 * @const {Schema} UserSchema
 * @property {string} uuid - 使用者的唯一識別碼，必填且唯一。
 * @property {string} name - 使用者名稱，必填，長度介於 8 到 24 字元之間。
 * @property {string} email - 使用者電子郵件，必填且唯一。
 * @property {string} password - 使用者密碼，必填。
 * @property {string} salt - 密碼鹽值，必填。
 * @property {Array<Schema>} wallet - 使用者的錢包，選填。
 * @property {Array<Schema>} exchange - 使用者的交易所，選填。
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
  wallet: {
    type: [WalletSchema],
    required: false,
  },
  exchange: {
    type: [ExchangeSchema],
    required: false,
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
