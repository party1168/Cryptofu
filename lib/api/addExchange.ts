import Exchange from "@/models/Exchange";
import connectDB from "@/lib/database/db";
import User from "@/models/User";
import { ExchangeParams } from "@/interfaces/exchange";

const addExchange = async (uuid: string, exchange: ExchangeParams) => {
  try {
    await connectDB();
    const user = await User.findOne({ uuid: uuid });
    if (!user) {
      throw new Error("User not found");
    }
    const newExchange = new Exchange(exchange);
    await newExchange.save();
    return true;
  } catch (err) {
    throw err;
  }
};

export default addExchange;
