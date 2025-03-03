export interface WalletParams {
  userId: string;
  label: string;
  address: string;
  blockchain: string;
  type: string;
  createAt: Date;
}
export interface WalletBalance {
  symbol: string;
  network: string;
  amount: string;
  price: number;
  totalprice: number;
}