import {Server} from "socket.io";
import http from "http";
import express from "express";


// create app
const app=express();

// create server
const server=http.createServer(app);

const io = new Server(server,{
    cors :{
        origin:["http://localhost:5173"],
    }
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
//  to store online user..
const userSocketMap ={};// {userId : socketId}

io.on("connection",(socket)=>{
    console.log("User connected",socket.id);

    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId]=socket.id;
    }
    
    // io.emit() is used to sent events to all the connnected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User is disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

// exporting io as app adns erver 
export {io,app,server};