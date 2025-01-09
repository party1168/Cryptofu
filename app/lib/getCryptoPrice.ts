/**
 * 獲取加密貨幣價格的 API 函數
 * 
 * @param {string} symbol - 加密貨幣的符號
 * @returns {Promise<any>} 返回包含加密貨幣價格的 Promise
 * @throws {Error} 當無法獲取加密貨幣價格時拋出錯誤
 */
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
