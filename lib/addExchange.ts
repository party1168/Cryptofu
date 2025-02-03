import Exchange from "@/models/Exchange";
import connectDB from "@/lib/db";
import User from "@/models/User";

export interface ExchangeParams {
  userId: string;
  name: string;
  APIkey: string;
  APIsecret: string;
  createAt: Date;
}

const addExchange = async (uuid: string, exchange: ExchangeParams) => {
  try {
    await connectDB();
    const user = await User.findOne({ uuid: uuid });
    if (!user) {
      throw new Error("User not found");
    }
    const newExchange = new Exchange(exchange);
    newExchange.save();
    return true;
  } catch (err) {
    throw err;
  }
};

export default addExchange;
