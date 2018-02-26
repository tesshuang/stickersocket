const server = require("http").Server();
const port = process.env.PORT || 4006;
var io = require("socket.io")(server);

var stiUsers = [];
var allStickers = [];

io.on("connection",function(socket){
    console.log("user has connected");
    
    stiUsers.push(socket.id);
    console.log(stiUsers);
    socket.emit("yourid", socket.id);
    
    io.emit("stickeruser", stiUsers);
    
    socket.on("stick", function(data){
        allStickers.push(data);
        io.emit("newsticker", allStickers);
    });
    
    io.emit("newsticker", allStickers);
    
    socket.on("picksticker", function(data){
        console.log("picked");
        /*io.emit("pickup", data);*/
    });
    
    socket.on("dropsticker", function(data){
        console.log(data);
        io.emit("dropdown", data);
    })
    
    socket.on("mymove", function(data){
        socket.broadcast.emit("newmove", data);
    });
    
    
    socket.on("disconnect", function(data){
       var index = stiUsers.indexOf(socket.id);
        stiUsers.splice(index, 1);
        io.emit("stickeruser", stiUsers);
    });
});

server.listen(port, (err)=>{
    if(err){
        console.log("Err is "+err);
        return false
    }
    console.log("Socket is running.");
})