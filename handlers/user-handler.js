const events = require("events");

const UserHandler = new events.EventEmitter();

UserHandler.on("login-com", async (user) => {
    user.save(function(err) {
        if (err){
            console.log("--- line:8|user-handler.js: ", err);
        }
    });
});

module.exports = UserHandler;