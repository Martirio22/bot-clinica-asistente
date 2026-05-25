class RecibirWhatsappWebhook {
  constructor(
    rawEventRepository, 
    chatMessageRepository, 
    webhookLogRepository, 
    externalWhatsappService,
    botMenuRepository,
    botMenuOptionRepository
  ) { 
    this.rawEventRepository = rawEventRepository; 
    this.chatMessageRepository = chatMessageRepository;
    this.webhookLogRepository = webhookLogRepository; 
    this.externalWhatsappService = externalWhatsappService;
    this.botMenuRepository = botMenuRepository;
    this.botMenuOptionRepository = botMenuOptionRepository;
  }

  async ejecutar(payload) {
    const startTime = Date.now();
    try {
      const eventType = payload.eventType || "MESSAGE_RECEIVED";
      await this.rawEventRepository.save({ 
        eventType, 
        phoneNumber: payload.from, 
        whatsappMessageId: payload.whatsappMessageId, 
        chatSessionId: payload.chatSessionId, 
        payload 
      });

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

        const textoUsuario = payload.messageText.trim().toLowerCase();
        let textoRespuestaBot = "";

        if (textoUsuario.includes('menú') || textoUsuario.includes('hola') || textoUsuario.includes('menu')) {
          let menuPrincipal = null;
          let opciones = [];

          try {
            if (this.botMenuRepository && typeof this.botMenuRepository.findMenuWithRules === 'function') {
              menuPrincipal = await this.botMenuRepository.findMenuWithRules({ isPrincipal: true });
            } else if (this.botMenuRepository && typeof this.botMenuRepository.findAll === 'function') {
              const menus = await this.botMenuRepository.findAll({ isPrincipal: true, isActive: true });
              menuPrincipal = menus.length > 0 ? menus[0] : null;
            } else if (this.botMenuRepository && typeof this.botMenuRepository.findOne === 'function') {
              menuPrincipal = await this.botMenuRepository.findOne({ where: { isPrincipal: true } });
            }
          } catch (dbError) {
          }

          try {
            if (menuPrincipal && this.botMenuOptionRepository && typeof this.botMenuOptionRepository.findAll === 'function') {
              opciones = await this.botMenuOptionRepository.findAll({ botMenuId: menuPrincipal.id, isActive: true });
            } else if (menuPrincipal && this.botMenuOptionRepository && typeof this.botMenuOptionRepository.findByMenu === 'function') {
              opciones = await this.botMenuOptionRepository.findByMenu(menuPrincipal.id);
            }
          } catch (dbError) {
          }
          if (menuPrincipal && opciones && opciones.length > 0) {
            textoRespuestaBot = `${menuPrincipal.title}\n\n${menuPrincipal.description || "Selecciona una opción:"}\n\n`;
            
            const opcionesOrdenadas = opciones.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
            opcionesOrdenadas.forEach((opcion) => {
              textoRespuestaBot += `${opcion.sequence || '•'}. ${opcion.text || opcion.optionText}\n`;
            });
          } 
          else {
            textoRespuestaBot = "Bienvenido a Clínica Central.\n\nPor favor selecciona una opción:\n\n1. Información de la clínica\n2. Consultar especialidades\n3. Agendar cita médica\n4. Ver mis citas\n5. Consultar receta médica\n6. Hablar con un asistente";
          }

          const payloadSaliente = {
            to: payload.from,
            whatsappLineId: payload.whatsappLineId || "line-main",
            type: "TEXT",
            message: textoRespuestaBot
          };

          await this.externalWhatsappService.enviarMensaje(payloadSaliente);
        }
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
      console.error(" [ERROR CRÍTICO EN WEBHOOK]:", error);
      
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