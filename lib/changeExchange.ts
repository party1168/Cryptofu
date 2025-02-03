import Exchange from "@/models/Exchange";
import connectDB from "@/lib/db";
import { ExchangeParams } from "@/lib/addExchange";

const changeExchange = async (id: string, update: Partial<ExchangeParams>) => {
  try {
    await connectDB();
    const updatedExchange = Exchange.findOneAndUpdate(
      { _id: id },
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedExchange) {
      throw new Error("Exchange not found");
    }
    return updatedExchange;
  } catch (err) {
    throw err;
  }
};

export default changeExchange;