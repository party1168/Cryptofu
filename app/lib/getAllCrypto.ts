import axios from "axios";

const filterPaths = (paths: string[]) => {
  return paths
    .filter((path) => /^\/[A-Z]+\/$/.test(path))
    .map((path) => path.replace(/^\/|\/$/g, ""));
};

export const getAllCryptoPricesApi = async () => {
  const response = await axios.get("https://cryptoprices.cc/sitemap.txt");
  const paths = (response.data as string)
    .split("\n")
    .filter((path) => path.trim() !== "");
  const filteredPaths = filterPaths(paths);

  return filteredPaths;
};
