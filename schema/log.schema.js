const { Schema, model } = require("mongoose");

const Log = new Schema({
  level: {
    type: String,
    required: true,
    enum: ["error", "warn", "info"]
  },
  message: {
    type: String,
    required: false
  },
  meta: {
    type: Schema.Types.Mixed,
    required: false
  }
}, {
  versionKey: false,
  timestamps: true
})

const LogSchema = model("Log", Log)
module.exports = LogSchema
