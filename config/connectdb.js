import mongoose from "mongoose";

const connectdb=async (DATABASE_URL)=>{
    try {
       
        await mongoose.connect(DATABASE_URL);
        console.log("DataBase Connected Sccesfully");
    } catch (error) {
        
    }
}
export default connectdb;