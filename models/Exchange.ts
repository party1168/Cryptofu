import mongoose, { Document, Schema } from "mongoose";

export interface IExchange extends Document {
  userId: string;
  name: string;
  APIkey: string;
  APIsecret: string;
  passphrase:string;
  createAt: Date;
}

const ExchangeSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  APIkey: { type: String, required: true },
  APIsecret: { type: String, required: true },
  passphrase: { type: String, required: false },
  createAt: { type: Date, default: Date.now },
});

const Exchange =
  mongoose.models.Exchange ||
  mongoose.model<IExchange>("Exchange", ExchangeSchema);

export default Exchange;
0;
