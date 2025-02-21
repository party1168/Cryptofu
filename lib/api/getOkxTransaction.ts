import { RestClient } from "okx-api";

const getOkxTransaction = async (
  APIkey: string,
  APIsecret: string,
  passphrase: string
) => {
  try {
    const client = new RestClient({
      apiKey: APIkey,
      apiSecret: APIsecret,
      apiPass: passphrase,
    });
    const transaction = await client.getBillsArchive({ instType: "SPOT" });
    return transaction;
  } catch (err) {
    throw err;
  }
};

export default getOkxTransaction;
