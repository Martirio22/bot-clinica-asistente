const { Schema, model } = require("mongoose");

const BotLogSchema = new Schema({
  level: { type: String, enum: ["INFO", "WARN", "ERROR"], required: true, index: true },
  module: { type: String, required: true, index: true },
  message: { type: String, required: true },
  chatSessionId: { type: String, required: false, index: true },
  error: { type: Schema.Types.Mixed, required: false }
}, { collection: "bot_logs", timestamps: { createdAt: true, updatedAt: false } });

module.exports = model("BotLog", BotLogSchema);