import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import {app,server} from "./utils/socket.js"
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { exec } from "child_process";



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
import { kMaxLength } from "buffer";

// routes decleration
app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoutes);


exec("ls -l /opt/render/project/src", (err, stdout, stderr) => {
    if (err) {
        console.error("Error listing directory:", err);
        return;
    }
    console.log("Directory structure at /opt/render/project/src:");
    console.log(stdout);
});


// pointint to forntend folder dist
// api and react application in same file...
const frontendPath = path.join(__dirname, "../frontend/dist");
console.log("Serving frontend from:", frontendPath);

// Check if the `index.html` file exists
if (fs.existsSync(path.join(frontendPath, "index.html"))) {
    console.log("index.html exists!");
} else {
    console.error("index.html does NOT exist!");
}

if (process.env.NODE_ENV === "production") {
    // Serve static files from the frontend/dist directory
    app.use(express.static(frontendPath));

    // Handle all unmatched routes by serving the frontend's index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

export {server};

