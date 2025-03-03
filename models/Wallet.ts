import mongoose, { Schema } from "mongoose";
import { IWallet } from "@/interfaces/models";
const supportedBlockchain = ["EVM"];

const WalletSchema: Schema = new Schema({
  userId: { type: String, required: true },
  label: { type: String, required: true },
  address: { type: String, required: true },
  blockchain: { type: String, enum: supportedBlockchain, required: true },
  type: { type: String, enum: ["hot", "cold"], required: true },
  createAt: { type: Date, default: Date.now },
});

WalletSchema.index({ userId: 1, address: 1 }, { unique: true });

const Wallet =
  mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema);

export default Wallet;
