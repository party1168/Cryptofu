import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { IUnifiedAsset } from "@/interfaces/utils";
import {
  IOkxAccountBalance,
  IOkxAssetBalance,
  IOkxFinanceBalance,
} from "@/interfaces/exchange";

const baseURL = "https://www.okx.com";

type spotParams = Pick<IUnifiedAsset, "symbol" | "amount">;

const convertAssetBalance = async (
  balance: IOkxAssetBalance[]
): Promise<spotParams[]> => {
  return balance.map((asset: IOkxAssetBalance) => {
    return {
      symbol: asset.ccy,
      amount: Number(asset.bal),
    };
  });
};
const convertAccountBalance = async (
  balance: IOkxAccountBalance[]
): Promise<spotParams[]> => {
  return balance.map((asset: IOkxAccountBalance) => {
    return {
      symbol: asset.ccy,
      amount: Number(asset.cashBal),
    };
  });
};

const convertFinanceBalance = async (
  balance: IOkxFinanceBalance[]
): Promise<spotParams[]> => {
  return balance.map((asset: IOkxFinanceBalance) => {
    return {
      symbol: asset.ccy,
      amount: Number(asset.amt),
    };
  });
};

const getOkxSpot = async (
  APIkey: string,
  APIsecret: string,
  passphrase: string
) => {
  const makeRequest = async (path: string) => {
    const method = "GET";
    const timestemp = new Date().toISOString();
    const prehash = timestemp + method + path;
    const signature = crypto
      .createHmac("sha256", APIsecret)
      .update(prehash)
      .digest("base64");
    const url = baseURL + path;
    const headers = {
      "OK-ACCESS-KEY": APIkey,
      "OK-ACCESS-SIGN": signature,
      "OK-ACCESS-TIMESTAMP": timestemp,
      "OK-ACCESS-PASSPHRASE": passphrase,
    };
    return axios.get(url, { headers });
  };
  try {
    const paths = [
      "/api/v5/asset/balances",
      "/api/v5/account/balance",
      "/api/v5/finance/savings/balance",
    ];
    const [assetBalances, accountBalance, financeBalance] = await Promise.all(
      paths.map(makeRequest)
    );
    const allBalances = await Promise.all([
      ...(await convertAssetBalance(assetBalances.data.data)),
      ...(await convertAccountBalance(accountBalance.data.data[0].details)),
      ...(await convertFinanceBalance(financeBalance.data.data)),
    ]);

    const spot: spotParams[] = allBalances
      .reduce((acc: spotParams[], bal) => {
        const existing = acc.find(
          (item: spotParams) => item.symbol === bal.symbol
        );
        if (existing) {
          existing.amount = Number(existing.amount) + Number(bal.amount);
        } else {
          acc.push(bal);
        }
        return acc;
      }, [] as spotParams[])
      .map((bal) => {
        return {
          symbol: bal.symbol,
          amount: Number(Number(bal.amount).toFixed(10)),
        };
      });
    let totalBalance = 0;
    const spotwPrice: IUnifiedAsset[] = await Promise.all(
      spot.map(async (item) => {
        if (item.symbol === "USDT" || item.symbol === "USDC") {
          return {
            ...item,
            price: 1,
            totalValue: Number(Number(item.amount).toFixed(3)),
          };
        }
        const path = `/api/v5/market/ticker?instId=${item.symbol}-USDT`;
        const res = await makeRequest(path);
        const price = res.data.data[0].last;
        const totalprice = Number(item.amount) * Number(price);
        totalBalance += totalprice;
        return {
          ...item,
          price: Number(price),
          totalValue: Number(totalprice.toFixed(3)),
        };
      })
    );
    spotwPrice.sort((a, b) => b.totalValue - a.totalValue);
    totalBalance = Number(totalBalance.toFixed(3));
    return {
      label: "OKX",
      assets: spotwPrice,
      totalBalance,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(JSON.stringify(err.response?.data || err.message));
    }
    throw err;
  }
};

export default getOkxSpot;
