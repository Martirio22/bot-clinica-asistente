class RecibirWhatsappWebhook {
  constructor(rawEventRepository, chatMessageRepository) { this.rawEventRepository=rawEventRepository; this.chatMessageRepository=chatMessageRepository; }
  async ejecutar(payload) {
    // Este use case representa la entrada desde whatsapp-web.js o un worker externo.
    // Se guarda el evento crudo en MongoDB y, si es un mensaje, se registra en chat_messages.
    const eventType = payload.eventType || "MESSAGE_RECEIVED";
    await this.rawEventRepository.save({ eventType, phoneNumber: payload.from, whatsappMessageId: payload.whatsappMessageId, chatSessionId: payload.chatSessionId, payload });

    let message = null;
    if (payload.chatSessionId && payload.messageText) {
      message = await this.chatMessageRepository.save({
        chatSessionId: payload.chatSessionId,
        patientId: payload.patientId || null,
        whatsappLineId: payload.whatsappLineId || null,
        appointmentId: payload.appointmentId || null,
        sender: payload.sender || "PATIENT",
        contentType: payload.contentType || "TEXT",
        messageText: payload.messageText,
        whatsappMessageId: payload.whatsappMessageId || null,
        metadata: payload
      });
    }
    return { received: true, message };
  }
}
module.exports = RecibirWhatsappWebhook;
