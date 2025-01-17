import axios from "axios";
/**
 * 過濾並格式化路徑數組，只保留符合特定模式的路徑。
 * 
 * @param paths - 路徑數組
 * @returns 過濾並格式化後的路徑數組
 */
const filterPaths = (paths: string[]) => {
  return paths
    .filter((path) => /^\/[A-Z]+\/$/.test(path))
    .map((path) => path.replace(/^\/|\/$/g, ""));
};

/**
 * 獲取所有加密貨幣價格的 API 路徑。
 * 
 * @returns 包含所有加密貨幣價格 API 路徑的數組
 */
export const getAllCryptoPricesApi = async () => {
  const response = await axios.get("https://cryptoprices.cc/sitemap.txt");
  const paths = (response.data as string)
    .split("\n")
    .filter((path) => path.trim() !== "");
  const filteredPaths = filterPaths(paths);

  return filteredPaths;
};
