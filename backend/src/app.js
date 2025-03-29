import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import {app,server} from "./utils/socket.js"
import bodyParser from "body-parser";
import path from "path";


const __dirname = path.resolve();

// to extract json data out of body
app.use(express.json({ limit: "1mb" })); // Set the limit explicitly
app.use(cookieParser());
// Increasing the limit..
app.use(bodyParser.json({ limit: "1mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// ...existing code...
app.use(
    cors({
    origin: "http://localhost:5173",
    credentials: true
}
));

//routes import
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/messageRoutes.js";

// routes decleration
app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoutes);
app.get("/api/health", (req, res) => {
    console.log("Health check endpoint hit: Server is working!");
    res.status(200).json({ message: "Server is working!" });
});


// pointint to forntend folder dist / its for onrander production...
// api and react application in same file...

const frontendPath = path.join(__dirname, "../frontend/dist");

if (process.env.NODE_ENV === "production") {
    // Serve static files from the frontend/dist directory
    app.use(express.static(frontendPath));

    // Handle all unmatched routes by serving the frontend's index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

export {server};

