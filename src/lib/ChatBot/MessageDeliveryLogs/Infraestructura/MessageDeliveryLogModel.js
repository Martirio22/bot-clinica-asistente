const { Schema, model } = require("mongoose");
const MessageDeliveryLogSchema = new Schema({
  chatMessageId: { type: Schema.Types.ObjectId, ref: "ChatMessage", required: true, index: true },
  chatSessionId: { type: String, required: true, index: true },
  whatsappMessageId: { type: String, required: true, index: true },
  status: { type: String, enum: ["SENT", "DELIVERED", "READ", "FAILED"], required: true },
  error: { type: String, required: false },
  metadata: { type: Schema.Types.Mixed, required: false }
}, { collection: "message_delivery_logs", timestamps: true });
module.exports = model("MessageDeliveryLog", MessageDeliveryLogSchema);
