class RecibirWhatsappWebhook {
  constructor(
    rawEventRepository, 
    chatMessageRepository, 
    webhookLogRepository,
    // --- INYECTAMOS LOS REPOSITORIOS CLAVE PARA EL FLUJO CONVERSACIONAL ---
    botMenuRepository,
    botMenuOptionRepository,
    specialtyRepository,
    doctorRepository,
    chatSessionRepository // Para saber en qué estado/menú está el paciente actualmente
  ) { 
    this.rawEventRepository = rawEventRepository; 
    this.chatMessageRepository = chatMessageRepository;
    this.webhookLogRepository = webhookLogRepository;
    
    // Asignamos las dependencias internas libres de HTTP/Tokens
    this.botMenuRepository = botMenuRepository;
    this.botMenuOptionRepository = botMenuOptionRepository;
    this.specialtyRepository = specialtyRepository;
    this.doctorRepository = doctorRepository;
    this.chatSessionRepository = chatSessionRepository;
  }

  async ejecutar(payload) {
    const startTime = Date.now();
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

        // ====================================================================
        // AQUÍ ES DONDE ARMAS TU FLUJO CONVERSACIONAL SIN PREOCUPARTE POR TOKENS
        // ====================================================================
        const textoUsuario = payload.messageText.trim().toLowerCase();

        if (textoUsuario === 'menú' || textoUsuario === 'hola') {
          // Ejemplo: Consultas el menú de bienvenida directo a la base de datos
          const menuPrincipal = await this.botMenuRepository.findMenuWithRules({ isPrincipal: true });
          // Lógica para formatear y responder al usuario...
        } 
        
        else if (textoUsuario === '1' || textoUsuario === 'especialidades') {
          // Ejemplo: Listas las especialidades directo usando Sequelize sin pasar por controladores
          const especialidades = await this.specialtyRepository.findAll({ isActive: true });
          // Armas el string: "Seleccione una especialidad: \n1. Cardiología..."
        } 
        
        else if (textoUsuario.startsWith('doctor_')) {
          // Ejemplo: Listas doctores de forma directa
          const especialidadId = textoUsuario.split('_')[1];
          const doctores = await this.doctorRepository.findAll({ specialtyId: especialidadId, isActive: true });
          // Armas la respuesta con los nombres de los doctores...
        }
      }

      // Registro de éxito en logs
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
      // Registro de errores en logs
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