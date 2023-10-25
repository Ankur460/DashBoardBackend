import dotenv from 'dotenv'
dotenv.config()
import  express  from 'express';
import cors from 'cors';
import connectdb from './config/connectdb.js';
const app=express();
import userRoutes from './routes/userRoute.js';



const DATABASE_URL =process.env.DATABASE_URL;
//cors Policy
app.use(cors());
app.use(express.json());


//DataBase Connection
connectdb(DATABASE_URL)


//Load Routes
app.use("/api/user",userRoutes);



const port=process.env.PORT;
app.listen(port,()=>{
    console.log("Sever run on port 3000");
})
