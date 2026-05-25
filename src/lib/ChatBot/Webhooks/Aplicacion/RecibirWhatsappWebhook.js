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
    let message = null;
    let textoRespuestaBot = ""; 

    try {
      const eventType = payload.eventType || "MESSAGE_RECEIVED";
      await this.rawEventRepository.save({ 
        eventType, 
        phoneNumber: payload.from, 
        whatsappMessageId: payload.whatsappMessageId, 
        chatSessionId: payload.chatSessionId, 
        payload 
      });

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

        if (textoUsuario.includes('menú') || textoUsuario.includes('hola') || textoUsuario.includes('menu')) {
          let menuPrincipal = null;
          let opciones = [];

          try {
            if (this.botMenuRepository && typeof this.botMenuRepository.findMenuWithRules === 'function') {
              menuPrincipal = await this.botMenuRepository.findMenuWithRules({ isPrincipal: true });
            } else if (this.botMenuRepository && typeof this.botMenuRepository.findAll === 'function') {
              const menus = await this.botMenuRepository.findAll({ 
                where: { is_main_menu: true, is_active: true } 
              }).catch(() => this.botMenuRepository.findAll({ isPrincipal: true, isActive: true }));
              
              menuPrincipal = menus && menus.length > 0 ? menus[0] : null;
            } else if (this.botMenuRepository && typeof this.botMenuRepository.findOne === 'function') {
              menuPrincipal = await this.botMenuRepository.findOne({ 
                where: { isMainMenu: true } 
              }).catch(() => this.botMenuRepository.findOne({ where: { isPrincipal: true } }));
            }
          } catch (dbError) {
            console.error("Error buscando menú principal:", dbError.message);
          }

          if (menuPrincipal && this.botMenuOptionRepository) {
            try {
              if (typeof this.botMenuOptionRepository.findAllByMenu === 'function') {
                opciones = await this.botMenuOptionRepository.findAllByMenu(menuPrincipal.id);
              }
            } catch (dbError) {
              console.error("Error cargando opciones:", dbError.message);
            }
          }

          if (menuPrincipal) {
            const tituloMenu = menuPrincipal.name || menuPrincipal.title || "Menú Principal";
            
            if (opciones && opciones.length > 0) {
              const descripcionBase = "Bienvenido a Clínica Central. ¿En qué podemos ayudarte? Responde con una opción:";
              textoRespuestaBot = `${tituloMenu}\n\n${descripcionBase}\n\n`;
              
              const opcionesOrdenadas = opciones.sort((a, b) => (a.order || a.sequence || 0) - (b.order || b.sequence || 0));
              
              opcionesOrdenadas.forEach((opcion) => {
                const textoOpcion = opcion.optionText || opcion.text || opcion.name;
                const numeroSecuencia = opcion.order || opcion.sequence || '•';
                textoRespuestaBot += `${numeroSecuencia}) ${textoOpcion}\n`;
              });
            } 
            else {
              const descripcionMenu = menuPrincipal.message || menuPrincipal.description || "Selecciona una opción:";
              textoRespuestaBot = `${tituloMenu}\n\n${descripcionMenu}`;
            }
          } else {
            textoRespuestaBot = "Bienvenido a Clínica Central.\n\nPor favor selecciona una opción:\n\n1. Información de la clínica\n2. Consultar especialidades\n3. Agendar cita médica";
          }

          const payloadSaliente = {
            to: payload.from,
            whatsappLineId: payload.whatsappLineId || "line-main",
            type: "TEXT",
            message: textoRespuestaBot,
            whatsappMessageId: payload.whatsappMessageId 
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

      return { 
        success: true,
        received: true, 
        message
      };

    } catch (error) {
      console.error("[ERROR CRÍTICO EN WEBHOOK]:", error);
      
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