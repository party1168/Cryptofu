import Subscriber from "@/models/Subscriber";
import validator from "validator";
import connectDB from "./db";

const addSubscriber = async (email: string): Promise<void> => {
  try {
    await connectDB();
    if (!email) {
      throw new Error("Email is required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email");
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      throw new Error("Subscriber already exists");
    }
    const subscriber = new Subscriber({
      email,
    });
    await subscriber.save();
  } catch (err) {
    throw err;
  }
};

export default addSubscriber;