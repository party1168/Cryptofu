import Wallet from "@/models/Wallet";
import connectDB from "@/lib/database/db";
import User from "@/models/User";
import { IWallet } from "@/interfaces/models";
const addWallet = async (uuid: string, wallet: Partial<IWallet>) => {
  try {
    await connectDB();
    const user = await User.findOne({ uuid: uuid });
    if (!user) {
      throw new Error("User not found");
    }
    const walletExists = await Wallet.findOne({
      userId: uuid,
      address: wallet.address,
    });
    if (walletExists) {
      throw new Error("Wallet already exists");
    }
    const newWallet = new Wallet(wallet);
    await newWallet.save();
    return true;
  } catch (err) {
    throw err;
  }
};

export default addWallet;
