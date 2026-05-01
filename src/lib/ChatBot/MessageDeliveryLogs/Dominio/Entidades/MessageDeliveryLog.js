class MessageDeliveryLog {
  constructor({ id, chatMessageId, chatSessionId, whatsappMessageId, status, error = null, metadata = null, createdAt = null }) {
    if (!chatMessageId) throw new Error("chatMessageId requerido");
    if (!chatSessionId) throw new Error("chatSessionId requerido");
    if (!whatsappMessageId) throw new Error("whatsappMessageId requerido");
    if (!status) throw new Error("status requerido");
    this.id = id;
    this.chatMessageId = chatMessageId; // Mongo ↔ Mongo: ObjectId ref ChatMessage
    this.chatSessionId = chatSessionId;
    this.whatsappMessageId = whatsappMessageId;
    this.status = status;
    this.error = error;
    this.metadata = metadata;
    this.createdAt = createdAt;
  }
}
module.exports = MessageDeliveryLog;
