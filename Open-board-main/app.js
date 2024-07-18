const express = require("express");
const socket = require("socket.io");

const app = express(); //initalizing the server

app.use(express.static("public"));

let port = process.env.PORT || 3000
let server = app.listen(port, () => {
     console.log("listenting to port!!!");
});

//io liye socket ko initzilize kiya 
let io = socket(server);  
//listner callback will run
io.on('connection', (socket) => {
    console.log("socket connection successfull!");
 //recived data
    socket.on("beginPath", (data) => {
        //transfer data 
        io.sockets.emit('beginPath', data);
    });

    socket.on("drawStroke", (data) => {
        io.sockets.emit('drawStroke', data);
    })

    socket.on("redoUndo" , (data) => {
        io.sockets.emit('redoUndo' , data);
    })
})