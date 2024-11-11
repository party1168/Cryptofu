import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    w_address: Array<string>;
    exchange:Array<string>;
}

const UserSchema: Schema = new Schema({
    name: {type: String , required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required:true},
    w_address: {type: Array<string>},
    exchange: [{
        name:{type: String,required:true},
        OAuth:{type:String,required:false}
    }]
});

const User = mongoose.models.User || mongoose.model<IUser>('User',UserSchema);
export default User;