import User from "../models/User";
import connectDB from "./db";

const addUser = async(
    uuid:string,
    name:string,
    email:string,
    inputPassword:string,
    wallet :Array<{name:string , address:string}> = [],
    exchange: Array<{name:string,OAuth:string}> = []) => {
    await connectDB();
    const user = new User({
        uuid: uuid,
        name: name,
        email: email,
        password: inputPassword,
        wallet: wallet,
        exchange: exchange
    });
    try{
        await user.save();
        return true;
    }catch(err){
        throw err;
    }
}

export default addUser;