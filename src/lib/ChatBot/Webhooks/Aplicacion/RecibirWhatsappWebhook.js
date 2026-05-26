class RecibirWhatsappWebhook {
  constructor(
    rawEventRepository,
    chatMessageRepository,
    webhookLogRepository,
    externalWhatsappService,
    botMenuRepository,
    botMenuOptionRepository,
    patientRepository,
    chatSessionRepository,
    specialtyRepository
  ) {
    this.rawEventRepository = rawEventRepository;
    this.chatMessageRepository = chatMessageRepository;
    this.webhookLogRepository = webhookLogRepository;
    this.externalWhatsappService = externalWhatsappService;
    this.botMenuRepository = botMenuRepository;
    this.botMenuOptionRepository = botMenuOptionRepository;
    this.patientRepository = patientRepository;
    this.chatSessionRepository = chatSessionRepository;
    this.specialtyRepository = specialtyRepository;
  }

  async ejecutar(payload) {
    const startTime = Date.now();

    try {
      const payloadNormalizado = this._normalizarPayloadEntrante(payload);

      this._validarPayload(payloadNormalizado);

      const eventType = payloadNormalizado.eventType || "MESSAGE_RECEIVED";
      const numeroPaciente = this._normalizarTelefono(payloadNormalizado.from);
      const textoUsuario = String(payloadNormalizado.messageText || "").trim();

      await this.rawEventRepository.save({
        eventType,
        phoneNumber: numeroPaciente,
        whatsappMessageId: payloadNormalizado.whatsappMessageId,
        chatSessionId: payloadNormalizado.chatSessionId || null,
        payload
      });

      const paciente = await this._obtenerOCrearPaciente({
        numeroPaciente,
        nombreWhatsapp: payload.patientWhatsappName || payload.profileName || "Paciente WhatsApp"
      });

      const sesion = await this._obtenerOCrearSesion({
        paciente,
        numeroPaciente,
        whatsappLineId: payload.whatsappLineId,
        nombreWhatsapp: payload.patientWhatsappName || payload.profileName || paciente.firstName
      });

      const mensajeEntrante = await this.chatMessageRepository.save({
        chatSessionId: sesion.id,
        patientId: paciente.id,
        whatsappLineId: payload.whatsappLineId,
        appointmentId: payload.appointmentId || null,
        sender: "PATIENT",
        contentType: payload.contentType || "TEXT",
        messageText: textoUsuario,
        whatsappMessageId: payload.whatsappMessageId || null,
        metadata: payload
      });

      const statusCode = sesion.status?.code;

      if (statusCode === "ATENCION_HUMANA" || statusCode === "ESPERANDO_ASISTENTE") {
        await this._guardarLogOk(payload, startTime);

        return {
          received: true,
          mode: "HUMAN_ATTENTION",
          message: mensajeEntrante,
          chatSession: sesion
        };
      }

      const respuestaBot = await this._resolverRespuestaBot({
        textoUsuario,
        sesion,
        paciente,
        payload
      });

      let resultadoWhatsapp = null;

      if (respuestaBot) {
        await this.chatMessageRepository.save({
          chatSessionId: sesion.id,
          patientId: paciente.id,
          whatsappLineId: payloadNormalizado.whatsappLineId,
          appointmentId: payloadNormalizado.appointmentId || null,
          sender: "BOT",
          contentType: "TEXT",
          messageText: respuestaBot,
          whatsappMessageId: null,
          metadata: {
            source: "BOT_RESPONSE",
            incomingWhatsappMessageId: payloadNormalizado.whatsappMessageId
          }
        });

        resultadoWhatsapp = await this.externalWhatsappService.enviarMensaje({
          to: payloadNormalizado.chatId || numeroPaciente,
          whatsappLineId: payloadNormalizado.whatsappLineId,
          type: "TEXT",
          message: respuestaBot
        });
      }

      await this._guardarLogOk(payload, startTime);

      return {
        success: true,
        action: "SEND_MESSAGES",
        chatSessionId: sesion.id,
        patientId: paciente.id,
        messages: respuestaBot
          ? [
            {
              type: "TEXT",
              text: respuestaBot
            }
          ]
          : [],
        whatsapp: resultadoWhatsapp
      };

    } catch (error) {
      console.error(" [ERROR CRÍTICO EN WEBHOOK]:", error);

      await this.webhookLogRepository.save({
        provider: "WHATSAPP",
        endpoint: "/api/chatbot/webhooks/whatsapp",
        httpMethod: "POST",
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
        payloadCrudo: payload,
        error: {
          message: error.message,
          stack: error.stack
        }
      });

      throw error;
    }
  }

  _validarPayload(payload) {
    if (!payload) {
      throw new Error("Payload requerido");
    }

    if (!payload.from) {
      throw new Error("from es requerido");
    }

    if (!payload.whatsappLineId) {
      throw new Error("whatsappLineId es requerido");
    }

    if (!payload.messageText) {
      throw new Error("messageText es requerido");
    }
  }

  _normalizarTelefono(telefono) {
    const limpio = String(telefono || "").replace(/\D/g, "");

    if (!limpio) {
      throw new Error("Número de WhatsApp inválido");
    }

    return limpio;
  }

  async _obtenerOCrearPaciente({ numeroPaciente, nombreWhatsapp }) {
    let paciente = await this.patientRepository.findByPhone(numeroPaciente);

    if (paciente) {
      return paciente;
    }

    const nombreLimpio = String(nombreWhatsapp || "Paciente WhatsApp").trim();

    paciente = await this.patientRepository.create({
      firstName: nombreLimpio,
      lastName: "WhatsApp",
      whatsappPhone: numeroPaciente,
      identificationType: null,
      identification: null,
      birthDate: null,
      gender: null,
      email: null,
      address: null,
      isActive: true
    });

    return paciente;
  }

  async _obtenerOCrearSesion({ paciente, numeroPaciente, whatsappLineId, nombreWhatsapp }) {
    let sesion = null;

    if (typeof this.chatSessionRepository.findActiveByWhatsappNumberAndLine === "function") {
      sesion = await this.chatSessionRepository.findActiveByWhatsappNumberAndLine(
        numeroPaciente,
        whatsappLineId
      );
    }

    if (sesion) {
      return sesion;
    }

    const sessionStatusId = await this.chatSessionRepository.findStatusByCode("BOT_ACTIVO");

    if (!sessionStatusId) {
      throw new Error("Estado BOT_ACTIVO no configurado");
    }

    sesion = await this.chatSessionRepository.create({
      patientId: paciente.id,
      whatsappLineId,
      sessionStatusId,
      patientWhatsappNumber: numeroPaciente,
      patientWhatsappName: nombreWhatsapp || paciente.firstName,
      handledByBot: true,
      assignedAssistantId: null,
      startDate: new Date()
    });

    return sesion;
  }

  async _resolverRespuestaBot({ textoUsuario, sesion, paciente, payload }) {
    const texto = String(textoUsuario || "").trim().toLowerCase();

    if (this._esSaludoOMenu(texto)) {
      return await this._construirMenuPrincipal();
    }

    if (this._esSeleccionNumerica(texto)) {
      return await this._resolverOpcionMenuPrincipal(texto, sesion);
    }

    return [
      "No logré identificar tu solicitud.",
      "Por favor selecciona una opción válida del menú:",
      "",
      await this._construirMenuPrincipal()
    ].join("\n");
  }

  _esSaludoOMenu(texto) {
    const saludos = [
      "hola",
      "hey",
      "buenas",
      "buenos dias",
      "buenos días",
      "buenas tardes",
      "buenas noches",
      "menu",
      "menú",
      "inicio"
    ];

    return saludos.includes(texto);
  }

  _esSeleccionNumerica(texto) {
    return /^[0-9]+$/.test(texto);
  }

  async _construirMenuPrincipal() {
    const menuPrincipal = await this.botMenuRepository.findMainMenu();

    if (!menuPrincipal || !menuPrincipal.isActive) {
      throw new Error("No existe un menú principal activo configurado");
    }

    const opciones = await this.botMenuOptionRepository.findAllByMenu(menuPrincipal.id);

    if (!opciones || opciones.length === 0) {
      return menuPrincipal.message;
    }

    const opcionesActivas = opciones
      .filter((opcion) => opcion.isActive)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    let texto = `${menuPrincipal.message}\n\n`;

    opcionesActivas.forEach((opcion) => {
      texto += `${opcion.order}. ${opcion.optionText}\n`;
    });

    return texto.trim();
  }

  async _resolverOpcionMenuPrincipal(codigoOpcion, sesion) {
    const menuPrincipal = await this.botMenuRepository.findMainMenu();

    if (!menuPrincipal || !menuPrincipal.isActive) {
      throw new Error("No existe un menú principal activo configurado");
    }

    const opcion = await this.botMenuOptionRepository.findByMenuAndCode(
      menuPrincipal.id,
      codigoOpcion
    );

    if (!opcion || !opcion.isActive) {
      return [
        "La opción seleccionada no es válida.",
        "",
        await this._construirMenuPrincipal()
      ].join("\n");
    }

    switch (opcion.action) {
      case "INFO_CLINICA":
        return this._respuestaInfoClinica();

      case "DERIVAR_ESPECIALISTA":
      case "CONSULTAR_ESPECIALIDADES":
        return await this._respuestaEspecialidades();

      case "AGENDAR_CITA":
        return this._respuestaAgendarCitaTemporal();

      case "CONSULTAR_CITAS":
        return this._respuestaConsultarCitasTemporal();

      case "CONSULTAR_RECETA":
        return this._respuestaConsultarRecetaTemporal();

      // case "TRANSFERIR_HUMANO":
      //   await this._transferirAHumano(sesion.id);
      //   return "Te estamos asignando un asistente clínico. Por favor espera un momento, pronto una persona de nuestro equipo continuará la atención.";
      case "TRANSFERIR_HUMANO":
        return [
          "La opción de hablar con un asistente todavía está en configuración.",
          "",
          "Por ahora puedes continuar usando el menú principal.",
          "",
          await this._construirMenuPrincipal()
        ].join("\n");

      case "MOSTRAR_MENU":
      case "MOSTRAR_OTRO_MENU":
        if (opcion.targetMenuId) {
          return await this._construirMenuPorId(opcion.targetMenuId);
        }

        return await this._construirMenuPrincipal();

      default:
        return [
          "Esta opción todavía no está configurada.",
          "",
          await this._construirMenuPrincipal()
        ].join("\n");
    }
  }

  async _construirMenuPorId(menuId) {
    const menu = await this.botMenuRepository.findById(menuId);

    if (!menu || !menu.isActive) {
      throw new Error("El menú destino no existe o no está activo");
    }

    const opciones = await this.botMenuOptionRepository.findAllByMenu(menu.id);

    if (!opciones || opciones.length === 0) {
      return menu.message;
    }

    const opcionesActivas = opciones
      .filter((opcion) => opcion.isActive)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    let texto = `${menu.message}\n\n`;

    opcionesActivas.forEach((opcion) => {
      texto += `${opcion.order}. ${opcion.optionText}\n`;
    });

    return texto.trim();
  }

  async _transferirAHumano(chatSessionId) {
    const statusId = await this.chatSessionRepository.findStatusByCode("ESPERANDO_ASISTENTE");

    if (!statusId) {
      throw new Error("Estado ESPERANDO_ASISTENTE no configurado");
    }

    await this.chatSessionRepository.update(chatSessionId, {
      sessionStatusId: statusId,
      handledByBot: false,
      assignedAssistantId: null
    });
  }

  _respuestaInfoClinica() {
    return [
      "Clínica Central atiende de lunes a viernes de 08:00 a 18:00.",
      "Estamos ubicados en Av. Principal y Calle Secundaria.",
      "Puedes agendar citas médicas por este medio."
    ].join("\n");
  }

  async _respuestaEspecialidades() {
    if (!this.specialtyRepository) {
      throw new Error("SpecialtyRepository no está configurado en el webhook");
    }

    const especialidades = await this.specialtyRepository.findAll();

    const activas = (especialidades || [])
      .filter((especialidad) => especialidad.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (activas.length === 0) {
      return [
        "Por el momento no tenemos especialidades activas registradas.",
        "",
        "Escribe *menu* para volver al menú principal."
      ].join("\n");
    }

    let texto = "Estas son nuestras especialidades disponibles:\n\n";

    activas.forEach((especialidad, index) => {
      texto += `${index + 1}. ${especialidad.name}\n`;
    });

    texto += "\nPuedes escribir *menu* para volver al menú principal.";

    return texto.trim();
  }

  _respuestaAgendarCitaTemporal() {
    return [
      "Perfecto, vamos a agendar tu cita médica.",
      "Por ahora estoy preparando el flujo de especialidad, médico y horario.",
      "",
      "Un asistente puede ayudarte si escribes 6."
    ].join("\n");
  }

  _respuestaConsultarCitasTemporal() {
    return "Estoy preparando la consulta de tus citas. Por ahora un asistente puede ayudarte escribiendo 6.";
  }

  _respuestaConsultarRecetaTemporal() {
    return "Estoy preparando la consulta de recetas médicas. Por ahora un asistente puede ayudarte escribiendo 6.";
  }

  async _guardarLogOk(payload, startTime) {
    await this.webhookLogRepository.save({
      provider: "WHATSAPP",
      endpoint: "/api/chatbot/webhooks/whatsapp",
      httpMethod: "POST",
      statusCode: 200,
      responseTimeMs: Date.now() - startTime,
      payloadCrudo: payload
    });
  }

  _normalizarPayloadEntrante(payload) {
    return {
      eventType: payload.eventType || payload.evento || payload.type || "MESSAGE_RECEIVED",

      from:
        payload.from ||
        payload.telefono ||
        payload.phoneNumber ||
        null,

      chatId:
        payload.chatId ||
        payload.whatsappChatId ||
        payload.chatSerializedId ||
        null,

      whatsappMessageId:
        payload.whatsappMessageId ||
        payload.messageId ||
        payload.id ||
        null,

      messageText:
        payload.messageText ||
        payload.mensaje ||
        payload.body ||
        payload.text ||
        "",

      whatsappLineId:
        payload.whatsappLineId ||
        payload.lineaId ||
        payload.lineId ||
        null,

      patientWhatsappName:
        payload.patientWhatsappName ||
        payload.nombreContacto ||
        payload.contactName ||
        payload.profileName ||
        "Paciente WhatsApp",

      chatSessionId: payload.chatSessionId || null,
      patientId: payload.patientId || null,
      appointmentId: payload.appointmentId || null,
      sender: payload.sender || "PATIENT",
      contentType: payload.contentType || payload.tipo || "TEXT",
      raw: payload
    };
  }
}

module.exports = RecibirWhatsappWebhook;