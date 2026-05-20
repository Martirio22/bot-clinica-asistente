const { Schema, model } = require("mongoose");

const ConversationContextSchema = new Schema({
  chatSessionId: { type: String, required: true, unique: true, index: true },
  currentStep: { type: String, required: true },
  lastIntent: { type: String, required: false },
  temporaryData: { type: Schema.Types.Mixed, default: {} }
}, { collection: "conversation_contexts", timestamps: true });

module.exports = model("ConversationContext", ConversationContextSchema);