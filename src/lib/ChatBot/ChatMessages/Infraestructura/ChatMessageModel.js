const { Schema, model } = require("mongoose");
const ChatMessageSchema = new Schema({
  chatSessionId: { type: String, required: true, index: true },
  patientId: { type: String, required: false, index: true },
  whatsappLineId: { type: String, required: false, index: true },
  appointmentId: { type: String, required: false, index: true },
  sender: { type: String, enum: ["PATIENT", "BOT", "ASSISTANT", "SYSTEM", "AI"], required: true },
  contentType: { type: String, enum: ["TEXT", "IMAGE", "AUDIO", "PDF", "LOCATION"], default: "TEXT" },
  messageText: { type: String, required: false },
  mediaUrl: { type: String, required: false },
  whatsappMessageId: { type: String, required: false, index: true },
  metadata: { type: Schema.Types.Mixed, required: false }
}, { collection: "chat_messages", timestamps: true });
module.exports = model("ChatMessage", ChatMessageSchema);
