export interface IOkxAssetBalance {
  ccy: string; // currency
  bal: string; // balance
  frozenBal: string;
  availBal: string;
}

export interface IOkxAccountBalance {
  ccy: string;
  cashBal: string;
  uTime: string;
  isoEq: string;
}

export interface IOkxFinanceBalance {
  ccy: string;
  amt: string;
  earnings: string;
  rate: string;
}

export interface IOkxBillArchiveType {
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
