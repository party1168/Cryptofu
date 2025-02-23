export interface TransactionRecords {}
export interface ExchangeParams {
  userId: string;
  name: string;
  APIkey: string;
  APIsecret: string;
  passphrase?: string;
  createAt: Date;
}
export interface exchangeResponse {
  label: string;
  assets: SpotBalance[];
  totalBalance: number;
}
export interface SpotBalance {
  symbol: string;
  amount: string;
  price: number;
  totalprice: number;
}
export interface AssetBalance {
  asset: string;
  amount: string;
}

export interface spotParams {
  symbol: string;
  amount: string;
}

export interface OKXAssetBalance {
  ccy: string; // currency
  bal: string; // balance
  frozenBal: string;
  availBal: string;
}

export interface OKXAccountBalance {
  ccy: string;
  cashBal: string;
  uTime: string;
  isoEq: string;
}

export interface OKXFinanceBalance {
  ccy: string;
  amt: string;
  earnings: string;
  rate: string;
}
