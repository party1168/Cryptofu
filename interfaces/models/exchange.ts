import { Document } from "mongoose";
export interface IExchange extends Document {
  userId: string;
  name: string;
  APIkey: string;
  APIsecret: string;
  passphrase?: string;
  createAt: Date;
}
