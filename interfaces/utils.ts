import { SpotBalance } from "@/interfaces/exchange";
import { WalletBalance } from "@/interfaces/wallet";
export interface CostResult {
  symbol: string;
  totalCost: number;
  totalQuantity: number;
  averageCost: number;
}
export interface BalanceResponse {
  label: string;
  assets: WalletBalance[] | SpotBalance[];
  totalBalance: number;
}

export interface CombinedAsset {
  symbol: string;
  totalAmount: number;
  price: number;
  totalValue: number;
}
