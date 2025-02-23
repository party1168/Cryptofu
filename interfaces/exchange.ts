export interface TransactionRecords {
  id: string;
  orderId: string;
  symbol: string;
  price: number;
  quantity: number;
  side: string;
  fee: number;
  feeCurrency: string;
  timestamp: string;
  marketType: string;
  note?: string;
  createAt?: string;
}
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

export interface OkxBillArchiveType {
  bal: string;
  balChg: string;
  billId: string;
  ccy: string;
  clOrdId: string;
  execType: string;
  fee: string;
  fillFwdPx: string;
  fillIdxPx: string;
  fillMarkPx: string;
  fillMarkVol: string;
  fillPxUsd: string;
  fillPxVol: string;
  fillTime: string;
  from: string;
  instId: string;
  instType: string;
  interest: string;
  mgnMode: string;
  notes: string;
  ordId: string;
  pnl: string;
  posBal: string;
  posBalChg: string;
  px: string;
  subType: string;
  sz: string;
  tag: string;
  to: string;
  tradeId: string;
  ts: string;
  type: string;
}
