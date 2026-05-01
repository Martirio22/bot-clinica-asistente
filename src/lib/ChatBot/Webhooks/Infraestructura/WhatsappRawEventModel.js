const { Schema, model } = require("mongoose");
const WhatsappRawEventSchema = new Schema({
  eventType: { type: String, required: true, index: true },
  phoneNumber: { type: String, required: false, index: true },
  whatsappMessageId: { type: String, required: false, index: true },
  chatSessionId: { type: String, required: false, index: true },
  payload: { type: Schema.Types.Mixed, required: true }
}, { collection: "whatsapp_raw_events", timestamps: true });
module.exports = model("WhatsappRawEvent", WhatsappRawEventSchema);
