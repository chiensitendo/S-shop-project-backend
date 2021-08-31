const events = require("events");
const { createVerifyToken } = require("../libs/bcryptUltility");
const { sendWelcomeMail, sendVerifyMail } = require("../services/email-service");
const { createRegisterLog } = require("../services/log-service");

const SendMailEvents = new events.EventEmitter();

SendMailEvents.on("reg-com-log", async (id) => {
    createRegisterLog(id);
});

SendMailEvents.on("reg-welcome-mail", async (user) => {
    let name = user.username;

    if (user.info.firstname){
        name = user.info.firstname;
    }
    if (user.info.lastname){
        name = name + " " + user.info.lastname;
    }
    sendWelcomeMail(name, user.email);
});

SendMailEvents.on("reg-verify-mail", async (user) => {
        createVerifyToken({
          id: user.id,
          username: user.username,
          email: user.email
        }).then(token => {
            let name = user.username;
            if (user.info.firstname){
                name = user.info.firstname;
            }
            if (user.info.lastname){
                name = name + " " + user.info.lastname;
            }
            sendVerifyMail(name, user.email, user.id, token);
        }).catch(err => {
            console.log("--- line:36|send-mail.js: ", err);
        });
});

module.exports = SendMailEvents;