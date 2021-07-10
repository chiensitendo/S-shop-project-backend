const { Server } = require("socket.io");
const moment = require("moment");
const { DATETIME_FULL_FORMAT } = require("../libs/const");
var ioInstance = null; 

class IO {
    constructor(server){
        if (server) {
            ioInstance = new Server(server,{
                cors: {
                  origin: "http://localhost:3000",
                  methods: ["GET", "POST"]
                }
               });
            
            ioInstance.on('connection', (socket) => {
                console.log('a user connected');
                if (socket.handshake.query['id']){
                  socket.id = socket.handshake.query['id'];
                }
                socket.emit("connection", {id: socket.id});
                socket.on("send", (message) => {
                  let mes = "Hello " + socket.id + "! Your message is: '" + message + "'. Received time: " + moment().format(DATETIME_FULL_FORMAT) + ".";
                  socket.emit("receive", mes);
                });
                
              });
            ioInstance.on("send", (message) => {
                console.log(message);
              });
        }

          
    }

    getIO(){
        return ioInstance;
    }
    
}


module.exports = IO;