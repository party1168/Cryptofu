import mongoose, { Document, Schema } from "mongoose";

export interface IWallet extends Document {
  userId: string;
  label: string;
  address: string;
  blockchain: string;
  type: string;
  createAt: Date;
}

const WalletSchema: Schema = new Schema({
  userId: { type: String, required: true },
  label: { type: String, required: true },
  address: { type: String, required: true },
  blockchain: { type: String, required: true },
  type: { type: String, enum: ["hot", "cold"], required: true },
  createAt: { type: Date, default: Date.now },
});

const Wallet =
  mongoose.model<IWallet>("Wallet", WalletSchema) || mongoose.models.Wallet;

export default Wallet;
