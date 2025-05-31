import { Document } from "mongoose";
export interface IUser extends Document {
  uuid: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  role: string;
}

export interface V_IUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
}
