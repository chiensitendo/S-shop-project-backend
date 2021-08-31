const events = require("events");
const { createRegisterLog, createLoginLog } = require("../services/log-service");

const LogRecorder = new events.EventEmitter();

LogRecorder.on("reg-com-log", async (id) => {
    createRegisterLog(id);
});

LogRecorder.on("login-com-log", async (id) => {
    createLoginLog(id);
});

module.exports = LogRecorder;