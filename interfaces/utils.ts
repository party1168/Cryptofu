import { SpotBalance } from "./exchange";
import { WalletBalance } from "@/interfaces/wallet/wallet";
export interface ICost {
  symbol: string;
  totalCost: number;
  totalQuantity: number;
  averageCost: number;
}
export interface IBalance {
  label: string;
  assets: WalletBalance[] | SpotBalance[];
  totalBalance: number;
}

export interface ICombinedAsset {
  symbol: string;
  totalAmount: number;
  price: number;
  totalValue: number;
}

export interface IAssets {
  symbol: string;
  totalAmount: number;
  averageCost: number;
  price: number;
  totalValue: number;
  roi: number;
}

export interface IPortfolio {
  assets: IAssets[];
  totalValue: number;
  totalReturn: number;
  totalROI: number;
}
