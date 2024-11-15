import mongoose from "mongoose";

const dbURL = process.env.MONGODB_URL;

let cachedDb: mongoose.Connection | null = null;

const connectDB = async() => {
    try{

        if(!dbURL){
            throw new Error(`MONGODB_URL not found ${dbURL}`);
        }
        if(cachedDb){
            console.log('Using cached database connection');
            return cachedDb;
        }

        console.log('Establishing new connection...');
        const db = await mongoose.connect(dbURL);

        cachedDb = db.connection;

        cachedDb.on('connected',()=>{
            console.log('Connect to database');
        });
        
        return cachedDb;
    }catch(err){
        throw err;
    }
}

export default connectDB