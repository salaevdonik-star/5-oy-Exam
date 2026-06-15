const Transport = require("winston-transport");
const LogSchema = require("../schema/log.schema");

class MongoTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...meta } = info;

    LogSchema.create({
      level,
      message,
      meta,
    }).catch((err) => {
      console.log("Log saqlashda xato:", err.message);
    });

    callback();
  }
}

module.exports = MongoTransport;
