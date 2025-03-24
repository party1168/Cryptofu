export interface IPortfolioAsset {
  symbol: string;
  totalAmount: number;
  averageCost: number;
  price: number;
  totalValue: number;
  roi: number;
}

export interface IDepositAmount {
  depositUSD: number;
  depositTWD: number;
}

export interface IUserPortfolioSummary {
  assets: IPortfolioAsset[];
  totalValue: number;
  totalReturn: number;
  totalROI: number;
  totalDeposit: IDepositAmount;
}
