import Document from "next/document";
export interface IWallet extends Document {
  userId: string;
  label: string;
  address: string;
  blockchain: string;
  type: string;
  createAt: Date;
}
