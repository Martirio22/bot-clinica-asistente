class ChatMessage {
  constructor({ id, chatSessionId, patientId = null, whatsappLineId = null, appointmentId = null, sender, contentType = "TEXT", messageText = null, mediaUrl = null, whatsappMessageId = null, metadata = null, createdAt = null }) {
    if (!chatSessionId) throw new Error("chatSessionId requerido");
    if (!sender) throw new Error("sender requerido");
    this.id = id;
    this.chatSessionId = chatSessionId; // referencia lógica hacia PostgreSQL chat_sessions.id
    this.patientId = patientId; // referencia lógica opcional hacia PostgreSQL patients.id
    this.whatsappLineId = whatsappLineId; // referencia lógica opcional hacia PostgreSQL whatsapp_lines.id
    this.appointmentId = appointmentId; // referencia lógica opcional hacia PostgreSQL appointments.id
    this.sender = sender;
    this.contentType = contentType;
    this.messageText = messageText;
    this.mediaUrl = mediaUrl;
    this.whatsappMessageId = whatsappMessageId;
    this.metadata = metadata;
    this.createdAt = createdAt;
  }
}
module.exports = ChatMessage;
