import mongoose, { Document, Schema } from "mongoose";

export interface IExchange extends Document {
  userId: string;
  name: string;
  APIkey: string;
  APIsecret: string;
  createAt: Date;
}

const ExchangeSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  APIkey: { type: String, required: true },
  APIsecret: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

const Exchange =
  mongoose.model<IExchange>("Exchange", ExchangeSchema) ||
  mongoose.models.Exchange;

export default Exchange;
