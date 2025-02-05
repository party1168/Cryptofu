import axios, { AxiosError } from "axios";
import crypto from "crypto";

const baseURL = "https://www.okx.com";

interface spotParams {
  symbol: string;
  amount: string;
}

interface OKXAssetBalance {
  ccy: string; // currency
  bal: string; // balance
  frozenBal: string;
  availBal: string;
}

interface OKXAccountBalance {
  ccy: string;
  cashBal: string;
  uTime: string;
  isoEq: string;
}

interface OKXFinanceBalance {
  ccy: string;
  amt: string;
  earnings: string;
  rate: string;
}

const convertAssetBalance = async (balance: OKXAssetBalance[]) => {
  return balance.map((asset: OKXAssetBalance) => {
    return {
      symbol: asset.ccy,
      amount: asset.bal,
    };
  });
};
const convertAccountBalance = async (balance: OKXAccountBalance[]) => {
  return balance.map((asset: OKXAccountBalance) => {
    return {
      symbol: asset.ccy,
      amount: asset.cashBal,
    };
  });
};

const convertFinanceBalance = async (balance: OKXFinanceBalance[]) => {
  return balance.map((asset: OKXFinanceBalance) => {
    return {
      symbol: asset.ccy,
      amount: asset.amt,
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

    const spot = allBalances
      .reduce((acc: spotParams[], bal) => {
        const existing = acc.find(
          (item: spotParams) => item.symbol === bal.symbol
        );
        if (existing) {
          existing.amount = (
            Number(existing.amount) + Number(bal.amount)
          ).toString();
        } else {
          acc.push(bal);
        }
        return acc;
      }, [] as spotParams[])
      .map((bal) => {
        return {
          symbol: bal.symbol,
          amount: Number(bal.amount).toFixed(10),
        };
      });
    return spot;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(JSON.stringify(err.response?.data || err.message));
    }
    throw err;
  }
};

export default getOkxSpot;
