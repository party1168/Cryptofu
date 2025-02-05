import axios from "axios";
import crypto from "crypto";

const getOKXSpot = async (
  APIkey: string,
  APIsecret: string,
  passphrase: string
) => {
  try {
    const timestamp = Date.now();
    const method = "GET";
    const path = "/api/v5/asset/balances";

    const sign = crypto
      .createHmac("sha256", APIsecret)
      .update(timestamp + method + path)
      .digest("base64");

    const response = await axios.get("/api/v5/asset/balances", {
      headers: {
        "OK-ACCESS-KEY": APIkey,
        "OK-ACCESS-SIGN": sign,
        "OK-ACCESS-TIMESTAMP": timestamp,
        "OK-ACCESS-PASSPHRASE": passphrase,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

export default getOKXSpot;
