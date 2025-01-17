import User from "@/models/User";
import connectDB from "./db";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// Generate UUID
const genUUID = async () => {
  try {
    while (true) {
      const uuid: string = uuidv4();
      const existingUUID = await User.findOne({ uuid: uuid });
      if (existingUUID) {
        continue;
      }
      return uuid;
    }
  } catch (err) {
    throw err;
  }
};

const addUser = async (
  name: string,
  email: string,
  inputPassword: string,
  wallet: Array<{ name: string; address: string }> = [],
  exchange: Array<{ name: string; OAuth: string }> = []
) => {
  await connectDB();
  // Validate Email
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  // Validate Password length
  if (inputPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  // Generate UUID
  const uuid: string = await genUUID();
  //generate salt
  const salt: string = bcrypt.genSaltSync(12);
  //assemble salt,uuid,password
  const saltedPassword: string = salt + inputPassword + uuid;
  // Encrypt Password
  const password: string = bcrypt.hashSync(saltedPassword, 10);

  const user = new User({
    uuid: uuid,
    name: name,
    email: email,
    password: password,
    salt: salt,
    wallet: wallet,
    exchange: exchange,
  });
  try {
    await user.save();
    return true;
  } catch (err) {
    throw err;
  }
};

export default addUser;
