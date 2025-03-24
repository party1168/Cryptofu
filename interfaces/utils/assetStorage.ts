import { IWalletAsset } from "../wallet";
import { IUnifiedAsset } from "./unifiedAsset";

export interface IAssetStorage {
  label: string;
  assets: IWalletAsset[] | IUnifiedAsset[];
  totalBalance: number;
}
