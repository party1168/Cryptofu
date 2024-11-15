import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    w_address: Array<string>;
    exchange:Array<string>;
}
export interface IWallet extends Document{
    name: string;
    address: string;
}
export interface IExchange extends Document{
    name: string;
    OAuth: string;
}

const WalletSchema: Schema = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true}
});
const ExchangeSchema: Schema = new Schema({
    name: {type: String, required: true},
    OAuth: {type: String, required: true}
});
const UserSchema: Schema = new Schema({
    name: {type: String , required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required:true},
    wallet: {type: [WalletSchema], required: false},
    exchange: {type: [ExchangeSchema], required: false}
});

const User = mongoose.models.User || mongoose.model<IUser>('User',UserSchema);
export default User;