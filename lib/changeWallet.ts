import Wallet from "@/models/Wallet";
import connectDB from "@/lib/db";
import { WalletParams } from "@/lib/addWallet";

const changeWallet = async (
  { userId, id }: { userId: string; id: string },
  update: Partial<WalletParams>
) => {
  try {
    await connectDB();
    const updatedWallet = Wallet.findOneAndUpdate(
      {
        _id: id,
        userId: userId,
      },
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedWallet) {
      throw new Error("Wallet not found");
    }
    return updatedWallet;
  } catch (err) {
    throw err;
  }
};

export default changeWallet;
