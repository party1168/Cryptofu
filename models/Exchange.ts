import mongoose, { Schema } from "mongoose";
import { IExchange } from "@/interfaces/models";
const ExchangeSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  APIkey: { type: String, required: true },
  APIsecret: { type: String, required: true },
  passphrase: { type: String, required: false },
  createAt: { type: Date, default: Date.now },
});

ExchangeSchema.index({ userId: 1, name: 1 }, { unique: true });

const Exchange =
  mongoose.models.Exchange ||
  mongoose.model<IExchange>("Exchange", ExchangeSchema);

export default Exchange;
0;
