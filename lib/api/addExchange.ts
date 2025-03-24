import Exchange from "@/models/Exchange";
import connectDB from "@/lib/database/db";
import User from "@/models/User";
import { IExchange } from "@/interfaces/models";

const addExchange = async (uuid: string, exchange: Partial<IExchange>) => {
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
