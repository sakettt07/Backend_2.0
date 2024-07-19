const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

io.on("connection",(socket)=>{
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id,...data})
    })
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id)
    })
    console.log(`${socket.id} is connected to the server`)
})




server.listen(3000, () => {
    console.log("Your server is running on port 3000");
});
