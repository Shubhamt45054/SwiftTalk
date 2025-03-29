import connectDB from "./src/utils/connectDB.js";
import {server} from './src/app.js'
import dotenv from "dotenv"
import cron from "node-cron";

// Schedule a task to run every minute
cron.schedule("* * * * *", () => {
    console.log(`Cron job executed at: ${new Date().toISOString()}`);
    // Add your task logic here
});

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
