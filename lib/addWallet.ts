import Wallet from "@/models/Wallet";
import connectDB from "@/lib/db";
import User from "@/models/User";

interface WalletParams {
  userId: string;
  label: string;
  address: string;
  blockchain: string;
  type: string;
  createAt: Date;
}

const addWallet = async (uuid: string, wallet: WalletParams) => {
  try {
    await connectDB();
    const user = await User.findOne({ uuid: uuid });
    if (!user) {
      throw new Error("User not found");
    }
    const newWallet = new Wallet(wallet);
    await newWallet.save();
    return true;
  } catch (err) {
    throw err;
  }
};

export default addWallet;
