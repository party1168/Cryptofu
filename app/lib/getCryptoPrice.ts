import axios from "axios";

export const getCryptoPricesApi = async (symbol: string) => {
  try {
    const response = await axios.get(`https://cryptoprices.cc/${symbol}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch crypto prices", (err as Error).message);
    throw new Error("Failed to fetch crypto prices");
  }
};
