import User from "../models/User";
import connectDB from "./db";

const addUser = async(name:string,
    email:string,
    password:string,
    wallet :Array<{name:string , address:string}> = [],
    exchange: Array<{name:string,OAuth:string}> = []) => {
    await connectDB();
    const user = new User({
        name: name,
        email: email,
        password: password,
        wallet: wallet,
        exchange: exchange
    });
    await user.save();
    return user;
}

export default addUser;