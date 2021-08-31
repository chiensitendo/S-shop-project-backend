const { Server } = require("socket.io");
const moment = require("moment");
const { DATETIME_FULL_FORMAT } = require("../libs/const");
var ioInstance = null; 

class IO {
    constructor(server){
        if (server) {
            ioInstance = new Server(server,{
                cors: {
                  origin: ['http://localhost:3000', 
                  'http://localhost:3000/', 
                  'https://s-shop-front-end-project.vercel.app',
                  'https://s-shop.vercel.app',
                  'https://so-cheap.vercel.app',
                  'https://s-shop-front-end-project-iwj01i5ot-chiensitendo1.vercel.app'
                ],
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

    getSocketById(id){
      if (!id){
        return null;
      }
      if (!ioInstance || !ioInstance.sockets || !ioInstance.sockets.sockets){
        return null;
      }
      return ioInstance.sockets.sockets.get(id);
    }
    
}


module.exports = IO;