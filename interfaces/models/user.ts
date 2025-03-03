import { Document } from 'mongoose';
export interface IUser extends Document {
  uuid: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  role: string;
}