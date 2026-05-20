class RecibirWhatsappWebhook {
  constructor(rawEventRepository, chatMessageRepository, webhookLogRepository) { 
    this.rawEventRepository = rawEventRepository; 
    this.chatMessageRepository = chatMessageRepository;
    this.webhookLogRepository = webhookLogRepository; 
  }
  async ejecutar(payload) {
    const startTime = Date.now();
    // Este use case representa la entrada desde whatsapp-web.js o un worker externo.
    // Se guarda el evento crudo en MongoDB y, si es un mensaje, se registra en chat_messages.
    try {
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
      await this.webhookLogRepository.save({
        provider: "WHATSAPP",
        endpoint: "/api/chatbot/webhooks/whatsapp",
        httpMethod: "POST",
        statusCode: 200,
        responseTimeMs: Date.now() - startTime,
        payloadCrudo: payload
      });

      return { received: true, message };

    } catch (error) {
      await this.webhookLogRepository.save({
        provider: "WHATSAPP",
        endpoint: "/api/chatbot/webhooks/whatsapp",
        httpMethod: "POST",
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
        payloadCrudo: payload,
        error: { message: error.message, stack: error.stack }
      });

      throw error;
    }
  }
}
module.exports = RecibirWhatsappWebhook;
