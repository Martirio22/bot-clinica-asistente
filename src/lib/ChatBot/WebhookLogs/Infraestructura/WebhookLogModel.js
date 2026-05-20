const { Schema, model } = require("mongoose");

const WebhookLogSchema = new Schema({
  provider: { type: String, required: true, index: true },
  endpoint: { type: String, required: true },
  httpMethod: { type: String, required: true },
  statusCode: { type: Number, required: true, index: true },
  responseTimeMs: { type: Number, required: true },
  payloadCrudo: { type: Schema.Types.Mixed, required: false },
  error: { type: Schema.Types.Mixed, required: false }
}, { collection: "webhook_logs", timestamps: { createdAt: true, updatedAt: false } });

module.exports = model("WebhookLog", WebhookLogSchema);