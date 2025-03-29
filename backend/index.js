import connectDB from "./src/utils/connectDB.js";
import {server} from './src/app.js'
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
