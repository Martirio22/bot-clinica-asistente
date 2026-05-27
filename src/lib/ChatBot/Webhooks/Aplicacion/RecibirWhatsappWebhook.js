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
    specialtyRepository,
    contextRepository,
    doctorRepository,
    crearAppointmentUseCase,
    disponibilidadUseCase,
    appointmentRepository,
    medicalPrescriptionRepository
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
    this.contextRepository = contextRepository;
    this.doctorRepository = doctorRepository;
    this.crearAppointmentUseCase = crearAppointmentUseCase;
    this.disponibilidadUseCase = disponibilidadUseCase;
    this.appointmentRepository = appointmentRepository;
    this.medicalPrescriptionRepository = medicalPrescriptionRepository;
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
        nombreWhatsapp: payloadNormalizado.patientWhatsappName || "Paciente WhatsApp"
      });

      const sesion = await this._obtenerOCrearSesion({
        paciente,
        numeroPaciente,
        whatsappLineId: payloadNormalizado.whatsappLineId,
        nombreWhatsapp: payloadNormalizado.patientWhatsappName || paciente.firstName
      });

      const mensajeEntrante = await this.chatMessageRepository.save({
        chatSessionId: sesion.id,
        patientId: paciente.id,
        whatsappLineId: payloadNormalizado.whatsappLineId,
        appointmentId: payloadNormalizado.appointmentId || null,
        sender: "PATIENT",
        contentType: payloadNormalizado.contentType || "TEXT",
        messageText: textoUsuario,
        whatsappMessageId: payloadNormalizado.whatsappMessageId || null,
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
      await this._guardarContexto({
        chatSessionId: sesion.id,
        currentStep: "MENU_PRINCIPAL",
        lastIntent: null,
        temporaryData: {}
      });

      return await this._construirMenuPrincipal();
    }

    const contexto = await this.contextRepository.findByChatSessionId(sesion.id);

    if (contexto?.lastIntent === "AGENDAR_CITA") {
      return await this._procesarFlujoAgendarCita({
        textoUsuario: texto,
        sesion,
        paciente,
        contexto
      });
    }

    if (contexto?.lastIntent === "CONSULTAR_RECETA") {
      return await this._procesarFlujoConsultarReceta({
        textoUsuario: texto,
        sesion,
        paciente,
        contexto
      });
    }

    if (this._esSeleccionNumerica(texto)) {
      return await this._resolverOpcionMenuPrincipal(texto, sesion, paciente);
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

  async _resolverOpcionMenuPrincipal(codigoOpcion, sesion, paciente) {
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

      // case "AGENDAR_CITA":
      //   return this._respuestaAgendarCitaTemporal();
      case "AGENDAR_CITA":
        return await this._iniciarFlujoAgendarCita(sesion);

      // case "CONSULTAR_CITAS":
      //   return this._respuestaConsultarCitasTemporal();
      case "CONSULTAR_CITAS":
        return await this._respuestaConsultarCitas(paciente);

      // case "CONSULTAR_RECETA":
      //   return this._respuestaConsultarRecetaTemporal();
      case "CONSULTAR_RECETA":
        return await this._iniciarFlujoConsultarReceta(sesion, paciente);

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

  // _respuestaAgendarCitaTemporal() {
  //   return [
  //     "Perfecto, vamos a agendar tu cita médica.",
  //     "Por ahora estoy preparando el flujo de especialidad, médico y horario.",
  //     "",
  //     "Un asistente puede ayudarte si escribes 6."
  //   ].join("\n");
  // }
  async _iniciarFlujoAgendarCita(sesion) {
    const especialidades = await this.specialtyRepository.findAll();

    const activas = (especialidades || [])
      .filter((x) => x.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (activas.length === 0) {
      return [
        "Por el momento no tenemos especialidades disponibles para agendar.",
        "",
        "Escribe *menu* para volver al menú principal."
      ].join("\n");
    }

    const opciones = activas.map((especialidad, index) => ({
      numero: index + 1,
      id: especialidad.id,
      name: especialidad.name
    }));

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "AGENDAR_SELECCION_ESPECIALIDAD",
      lastIntent: "AGENDAR_CITA",
      temporaryData: {
        especialidades: opciones
      }
    });

    let texto = "Perfecto, vamos a agendar tu cita médica.\n\n";
    texto += "Primero selecciona una especialidad:\n\n";

    opciones.forEach((opcion) => {
      texto += `${opcion.numero}. ${opcion.name}\n`;
    });

    texto += "\nEscribe el número de la especialidad.";
    texto += "\n\nTambién puedes escribir *menu* para volver al menú principal.";

    return texto.trim();
  }

  async _procesarFlujoAgendarCita({ textoUsuario, sesion, paciente, contexto }) {
    if (textoUsuario === "cancelar") {
      await this._guardarContexto({
        chatSessionId: sesion.id,
        currentStep: "MENU_PRINCIPAL",
        lastIntent: null,
        temporaryData: {}
      });

      return [
        "Agendamiento cancelado.",
        "",
        await this._construirMenuPrincipal()
      ].join("\n");
    }

    switch (contexto.currentStep) {
      case "AGENDAR_SELECCION_ESPECIALIDAD":
        return await this._agendarSeleccionarEspecialidad({
          textoUsuario,
          sesion,
          contexto
        });

      case "AGENDAR_SELECCION_MEDICO":
        return await this._agendarSeleccionarMedico({
          textoUsuario,
          sesion,
          contexto
        });

      case "AGENDAR_INGRESAR_FECHA":
        return await this._agendarIngresarFecha({
          textoUsuario,
          sesion,
          contexto
        });

      case "AGENDAR_SELECCION_HORARIO":
        return await this._agendarSeleccionarHorario({
          textoUsuario,
          sesion,
          contexto
        });

      case "AGENDAR_MOTIVO":
        return await this._agendarIngresarMotivo({
          textoUsuario,
          sesion,
          contexto
        });

      case "AGENDAR_CONFIRMAR":
        return await this._agendarConfirmar({
          textoUsuario,
          sesion,
          paciente,
          contexto
        });

      default:
        return await this._iniciarFlujoAgendarCita(sesion);
    }
  }

  async _agendarSeleccionarEspecialidad({ textoUsuario, sesion, contexto }) {
    const numero = Number(textoUsuario);

    if (!Number.isInteger(numero)) {
      return "Por favor escribe el número de la especialidad que deseas seleccionar.";
    }

    const especialidades = contexto.temporaryData?.especialidades || [];
    const seleccionada = especialidades.find((x) => x.numero === numero);

    if (!seleccionada) {
      return "La especialidad seleccionada no es válida. Escribe un número de la lista.";
    }

    const medicos = await this.doctorRepository.findBySpecialty(seleccionada.id);

    const activos = (medicos || [])
      .filter((x) => x.isActive && x.attendsWhatsApp)
      .map((medico, index) => ({
        numero: index + 1,
        id: medico.id,
        name: this._nombreMedico(medico),
        appointmentDurationMinutes: medico.appointmentDurationMinutes
      }));

    if (activos.length === 0) {
      return [
        `No tenemos médicos disponibles por WhatsApp para ${seleccionada.name}.`,
        "",
        "Escribe *menu* para volver al menú principal."
      ].join("\n");
    }

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "AGENDAR_SELECCION_MEDICO",
      lastIntent: "AGENDAR_CITA",
      temporaryData: {
        ...contexto.temporaryData,
        selectedSpecialty: seleccionada,
        medicos: activos
      }
    });

    let texto = `Seleccionaste ${seleccionada.name}.\n\n`;
    texto += "Ahora selecciona un médico:\n\n";

    activos.forEach((medico) => {
      texto += `${medico.numero}. ${medico.name}\n`;
    });

    texto += "\nEscribe el número del médico.";

    return texto.trim();
  }

  async _agendarSeleccionarMedico({ textoUsuario, sesion, contexto }) {
    const numero = Number(textoUsuario);

    if (!Number.isInteger(numero)) {
      return "Por favor escribe el número del médico que deseas seleccionar.";
    }

    const medicos = contexto.temporaryData?.medicos || [];
    const seleccionado = medicos.find((x) => x.numero === numero);

    if (!seleccionado) {
      return "El médico seleccionado no es válido. Escribe un número de la lista.";
    }

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "AGENDAR_INGRESAR_FECHA",
      lastIntent: "AGENDAR_CITA",
      temporaryData: {
        ...contexto.temporaryData,
        selectedDoctor: seleccionado
      }
    });

    return [
      `Seleccionaste ${seleccionado.name}.`,
      "",
      "Ahora escribe la fecha para consultar horarios disponibles.",
      "Formato: *AAAA-MM-DD*",
      "",
      "Ejemplo: 2026-05-28"
    ].join("\n");
  }

  async _agendarIngresarFecha({ textoUsuario, sesion, contexto }) {
    const fecha = textoUsuario.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return [
        "La fecha no tiene el formato correcto.",
        "Por favor escribe la fecha así: *AAAA-MM-DD*",
        "",
        "Ejemplo: 2026-05-28"
      ].join("\n");
    }

    const fechaSolicitada = new Date(`${fecha}T00:00:00-05:00`);

    if (isNaN(fechaSolicitada.getTime())) {
      return [
        "La fecha ingresada no es válida.",
        "Por favor escribe una fecha correcta con formato *AAAA-MM-DD*.",
        "",
        "Ejemplo: 2026-05-28"
      ].join("\n");
    }

    const ahora = new Date();
    const minAllowedDate = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const selectedDoctor = contexto.temporaryData?.selectedDoctor;

    if (!selectedDoctor) {
      return await this._iniciarFlujoAgendarCita(sesion);
    }

    const disponibilidad = await this.disponibilidadUseCase.ejecutar(
      selectedDoctor.id,
      fecha
    );

    let slots = (disponibilidad.slots || []).map((slot, index) => ({
      numero: index + 1,
      inicio: slot.inicio,
      fin: slot.fin
    }));

    // Filtrar horarios que no cumplen las 24 horas de anticipación
    slots = slots.filter((slot) => {
      const inicioSlot = this._slotInicioToDate(slot.inicio);
      return inicioSlot && inicioSlot >= minAllowedDate;
    });

    // Reordenar numeración después de filtrar
    slots = slots.map((slot, index) => ({
      ...slot,
      numero: index + 1
    }));

    if (slots.length === 0) {
      return [
        "No encontré horarios disponibles para esa fecha.",
        "",
        "Recuerda que las citas deben programarse con al menos 24 horas de anticipación.",
        "",
        "Por favor escribe otra fecha con formato *AAAA-MM-DD*.",
        "Ejemplo: 2026-05-28"
      ].join("\n");
    }

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "AGENDAR_SELECCION_HORARIO",
      lastIntent: "AGENDAR_CITA",
      temporaryData: {
        ...contexto.temporaryData,
        selectedDate: fecha,
        branchId: disponibilidad.sucursalId,
        officeId: disponibilidad.consultorioId,
        slots
      }
    });

    let texto = `Estos son los horarios disponibles para ${fecha}:\n\n`;

    slots.slice(0, 10).forEach((slot) => {
      texto += `${slot.numero}. ${this._formatearHoraSlot(slot.inicio)}\n`;
    });

    texto += "\nEscribe el número del horario que deseas.";

    return texto.trim();
  }

  _slotInicioToDate(valor) {
    const texto = String(valor || "").trim();

    if (!texto) return null;

    // Si viene como "2026-05-26 08:00:00"
    if (texto.includes(" ") && !texto.includes("T")) {
      const fechaIso = `${texto.replace(" ", "T")}-05:00`;
      const date = new Date(fechaIso);
      return isNaN(date.getTime()) ? null : date;
    }

    // Si ya viene como "2026-05-26T08:00:00"
    if (texto.includes("T")) {
      const fechaIso = texto.includes("-05:00") ? texto : `${texto}-05:00`;
      const date = new Date(fechaIso);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  }

  async _agendarSeleccionarHorario({ textoUsuario, sesion, contexto }) {
    const numero = Number(textoUsuario);

    if (!Number.isInteger(numero)) {
      return "Por favor escribe el número del horario que deseas seleccionar.";
    }

    const slots = contexto.temporaryData?.slots || [];
    const seleccionado = slots.find((x) => x.numero === numero);

    if (!seleccionado) {
      return "El horario seleccionado no es válido. Escribe un número de la lista.";
    }

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "AGENDAR_MOTIVO",
      lastIntent: "AGENDAR_CITA",
      temporaryData: {
        ...contexto.temporaryData,
        selectedSlot: seleccionado
      }
    });

    return [
      `Seleccionaste el horario ${this._formatearHoraSlot(seleccionado.inicio)}.`,
      "",
      "Ahora escribe el motivo de la consulta.",
      "",
      "Ejemplo: Dolor de cabeza, control médico, fiebre, chequeo general."
    ].join("\n");
  }

  async _agendarIngresarMotivo({ textoUsuario, sesion, contexto }) {
    const motivo = textoUsuario.trim();

    if (motivo.length < 3) {
      return "Por favor escribe un motivo de consulta más claro.";
    }

    const data = {
      ...contexto.temporaryData,
      reason: motivo
    };

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "AGENDAR_CONFIRMAR",
      lastIntent: "AGENDAR_CITA",
      temporaryData: data
    });

    const resumen = this._construirResumenCita(data);

    return [
      "Por favor confirma tu cita:",
      "",
      resumen,
      "",
      "Responde *SI* para confirmar o *NO* para cancelar."
    ].join("\n");
  }

  async _agendarConfirmar({ textoUsuario, sesion, paciente, contexto }) {
    const texto = textoUsuario.trim().toLowerCase();

    if (texto === "no") {
      await this._guardarContexto({
        chatSessionId: sesion.id,
        currentStep: "MENU_PRINCIPAL",
        lastIntent: null,
        temporaryData: {}
      });

      return [
        "Cita cancelada. No se registró ninguna cita.",
        "",
        await this._construirMenuPrincipal()
      ].join("\n");
    }

    if (texto !== "si" && texto !== "sí") {
      return "Por favor responde *SI* para confirmar o *NO* para cancelar.";
    }

    const data = contexto.temporaryData;

    const startDate = this._slotInicioToIso(data.selectedSlot.inicio);

    let cita = null;

    try {
      cita = await this.crearAppointmentUseCase.ejecutar({
        patientId: paciente.id,
        doctorId: data.selectedDoctor.id,
        startDate,
        reason: data.reason,
        origin: "WHATSAPP",
        isCreatedByBot: true,
        observation: "Cita creada desde bot de WhatsApp"
      });
    } catch (error) {
      const mensajeError = error.message || "No se pudo registrar la cita médica.";

      await this._guardarContexto({
        chatSessionId: sesion.id,
        currentStep: "AGENDAR_INGRESAR_FECHA",
        lastIntent: "AGENDAR_CITA",
        temporaryData: {
          selectedSpecialty: data.selectedSpecialty,
          especialidades: data.especialidades,
          medicos: data.medicos,
          selectedDoctor: data.selectedDoctor
        }
      });

      return [
        "No pude registrar la cita médica.",
        "",
        mensajeError,
        "",
        "Por favor escribe otra fecha para consultar nuevos horarios.",
        "Formato: *AAAA-MM-DD*",
        "",
        "Ejemplo: 2026-05-28"
      ].join("\n");
    }

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "MENU_PRINCIPAL",
      lastIntent: null,
      temporaryData: {
        lastAppointmentId: cita.id
      }
    });

    return [
      "Tu cita médica ha sido registrada correctamente.",
      "",
      `Especialidad: ${data.selectedSpecialty.name}`,
      `Médico: ${data.selectedDoctor.name}`,
      `Fecha y hora: ${this._formatearFechaHora(data.selectedSlot.inicio)}`,
      `Motivo: ${data.reason}`,
      "",
      "Te esperamos 15 minutos antes de la hora indicada."
    ].join("\n");
  }

  async _guardarContexto({ chatSessionId, currentStep, lastIntent = null, temporaryData = {} }) {
    return await this.contextRepository.save({
      chatSessionId,
      currentStep,
      lastIntent,
      temporaryData
    });
  }

  _nombreMedico(medico) {
    const user = medico.user;

    if (!user) {
      return "Médico";
    }

    const nombres = [
      user.firstName,
      user.lastName
    ].filter(Boolean).join(" ");

    return nombres || "Médico";
  }

  _formatearHoraSlot(valor) {
    if (!valor) return "";

    const partes = String(valor).split(" ");

    if (partes.length >= 2) {
      return partes[1].substring(0, 5);
    }

    return String(valor);
  }

  _formatearFechaHora(valor) {
    if (!valor) return "";

    const partes = String(valor).split(" ");

    if (partes.length >= 2) {
      return `${partes[0]} ${partes[1].substring(0, 5)}`;
    }

    return String(valor);
  }

  _slotInicioToIso(valor) {
    const texto = String(valor || "").trim();

    if (texto.includes("T")) {
      return texto.includes("-05:00") ? texto : `${texto}-05:00`;
    }

    return `${texto.replace(" ", "T")}-05:00`;
  }

  _construirResumenCita(data) {
    return [
      `Especialidad: ${data.selectedSpecialty?.name}`,
      `Médico: ${data.selectedDoctor?.name}`,
      `Fecha y hora: ${this._formatearFechaHora(data.selectedSlot?.inicio)}`,
      `Motivo: ${data.reason}`
    ].join("\n");
  }

  // _respuestaConsultarCitasTemporal() {
  //   return "Estoy preparando la consulta de tus citas. Por ahora un asistente puede ayudarte escribiendo 6.";
  // }
  async _respuestaConsultarCitas(paciente) {
    if (!this.appointmentRepository) {
      throw new Error("AppointmentRepository no está configurado en el webhook");
    }

    const citas = await this.appointmentRepository.findAll({
      patientId: paciente.id,
      isActive: true
    });

    if (!citas || citas.length === 0) {
      return [
        "No encontré citas médicas registradas a tu nombre.",
        "",
        "Puedes escribir *menu* para volver al menú principal."
      ].join("\n");
    }

    const ahora = new Date();

    const futuras = citas
      .filter((cita) => new Date(cita.startDate) >= ahora)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const pasadas = citas
      .filter((cita) => new Date(cita.startDate) < ahora)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    let texto = "";

    if (futuras.length > 0) {
      texto += "Tus próximas citas médicas son:\n\n";

      futuras.slice(0, 5).forEach((cita, index) => {
        texto += `${index + 1}. ${this._formatearCita(cita)}\n\n`;
      });
    } else {
      texto += "No tienes citas médicas próximas.\n\n";
    }

    if (pasadas.length > 0) {
      texto += "Tus últimas citas registradas fueron:\n\n";

      pasadas.slice(0, 3).forEach((cita, index) => {
        texto += `${index + 1}. ${this._formatearCita(cita)}\n\n`;
      });
    }

    texto += "Puedes escribir *menu* para volver al menú principal.";

    return texto.trim();
  }

  _formatearCita(cita) {
    const especialidad = cita.specialty?.name || "Especialidad no registrada";
    const medico = this._nombreMedicoDesdeCita(cita);
    const fechaHora = this._formatearFechaHoraCita(cita.startDate);
    const sucursal = cita.branch?.name || "Sucursal no registrada";
    const consultorio = cita.office?.name || "Consultorio no registrado";
    const estado = cita.status?.name || cita.status?.code || "Estado no registrado";
    const motivo = cita.reason || "Sin motivo registrado";

    return [
      `Especialidad: ${especialidad}`,
      `Médico: ${medico}`,
      `Fecha y hora: ${fechaHora}`,
      `Sucursal: ${sucursal}`,
      `Consultorio: ${consultorio}`,
      `Estado: ${estado}`,
      `Motivo: ${motivo}`
    ].join("\n");
  }

  _nombreMedicoDesdeCita(cita) {
    const user = cita.doctor?.user;

    if (user) {
      const nombre = [
        user.firstName,
        user.lastName
      ].filter(Boolean).join(" ");

      if (nombre) return nombre;
    }

    if (cita.doctor?.professionalRegistry) {
      return `Médico registro ${cita.doctor.professionalRegistry}`;
    }

    if (cita.doctorId) {
      return `Médico ID ${cita.doctorId}`;
    }

    return "Médico no registrado";
  }

  _formatearFechaHoraCita(valor) {
    if (!valor) return "Fecha no registrada";

    const fecha = new Date(valor);

    if (isNaN(fecha.getTime())) {
      return String(valor);
    }

    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const dd = String(fecha.getDate()).padStart(2, "0");
    const hh = String(fecha.getHours()).padStart(2, "0");
    const min = String(fecha.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  // _respuestaConsultarRecetaTemporal() {
  //   return "Estoy preparando la consulta de recetas médicas. Por ahora un asistente puede ayudarte escribiendo 6.";
  // }
  async _iniciarFlujoConsultarReceta(sesion, paciente) {
    if (!this.medicalPrescriptionRepository) {
      throw new Error("MedicalPrescriptionRepository no está configurado en el webhook");
    }

    const recetas = await this.medicalPrescriptionRepository.findAllByPatient(paciente.id);

    const activas = (recetas || [])
      .filter((receta) => receta.isActive)
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

    if (activas.length === 0) {
      await this._guardarContexto({
        chatSessionId: sesion.id,
        currentStep: "MENU_PRINCIPAL",
        lastIntent: null,
        temporaryData: {}
      });

      return [
        "No encontré recetas médicas registradas a tu nombre.",
        "",
        "Puedes escribir *menu* para volver al menú principal."
      ].join("\n");
    }

    if (activas.length === 1) {
      await this._guardarContexto({
        chatSessionId: sesion.id,
        currentStep: "MENU_PRINCIPAL",
        lastIntent: null,
        temporaryData: {}
      });

      return this._formatearRecetaCompleta(activas[0]);
    }

    const opciones = activas.slice(0, 10).map((receta, index) => ({
      numero: index + 1,
      id: receta.id,
      prescriptionCode: receta.prescriptionCode,
      issueDate: receta.issueDate,
      doctorName: this._nombreMedicoDesdeReceta(receta)
    }));

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "RECETA_SELECCIONAR",
      lastIntent: "CONSULTAR_RECETA",
      temporaryData: {
        recetas: opciones
      }
    });

    let texto = "Encontré estas recetas médicas a tu nombre:\n\n";

    opciones.forEach((receta) => {
      texto += `${receta.numero}. Receta ${receta.prescriptionCode || "Sin código"}\n`;
      texto += `   Fecha: ${this._formatearFechaReceta(receta.issueDate)}\n`;
      texto += `   Médico: ${receta.doctorName}\n\n`;
    });

    texto += "Escribe el número de la receta que deseas consultar.";
    texto += "\nTambién puedes escribir *menu* para volver al menú principal.";

    return texto.trim();
  }

  async _procesarFlujoConsultarReceta({ textoUsuario, sesion, paciente, contexto }) {
    const texto = String(textoUsuario || "").trim().toLowerCase();

    if (texto === "cancelar") {
      await this._guardarContexto({
        chatSessionId: sesion.id,
        currentStep: "MENU_PRINCIPAL",
        lastIntent: null,
        temporaryData: {}
      });

      return [
        "Consulta de receta cancelada.",
        "",
        await this._construirMenuPrincipal()
      ].join("\n");
    }

    if (contexto.currentStep !== "RECETA_SELECCIONAR") {
      return await this._iniciarFlujoConsultarReceta(sesion, paciente);
    }

    const numero = Number(texto);

    if (!Number.isInteger(numero)) {
      return "Por favor escribe el número de la receta que deseas consultar.";
    }

    const recetas = contexto.temporaryData?.recetas || [];
    const seleccionada = recetas.find((receta) => receta.numero === numero);

    if (!seleccionada) {
      return "La opción seleccionada no es válida. Escribe un número de la lista.";
    }

    const receta = await this.medicalPrescriptionRepository.findById(seleccionada.id);

    await this._guardarContexto({
      chatSessionId: sesion.id,
      currentStep: "MENU_PRINCIPAL",
      lastIntent: null,
      temporaryData: {
        lastPrescriptionId: receta?.id || seleccionada.id
      }
    });

    if (!receta) {
      return [
        "No pude encontrar la receta seleccionada.",
        "",
        "Escribe *menu* para volver al menú principal."
      ].join("\n");
    }

    return this._formatearRecetaCompleta(receta);
  }

  _formatearRecetaCompleta(receta) {
    const detalles = (receta.items || [])
      .filter((item) => item.isActive)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    let texto = "Tu receta médica es:\n\n";

    texto += `Receta: ${receta.prescriptionCode || "Sin código"}\n`;
    texto += `Fecha: ${this._formatearFechaReceta(receta.issueDate)}\n`;
    texto += `Médico: ${this._nombreMedicoDesdeReceta(receta)}\n\n`;

    if (detalles.length === 0) {
      texto += "Esta receta no tiene medicamentos registrados.\n\n";
    } else {
      texto += "Medicamentos:\n\n";

      detalles.forEach((item, index) => {
        texto += `${index + 1}. ${item.medicine}\n`;
        texto += `   Dosis: ${item.dose || "No registrada"}\n`;
        texto += `   Frecuencia: ${item.frequency || "No registrada"}\n`;
        texto += `   Duración: ${item.duration || "No registrada"}\n`;

        if (item.indications) {
          texto += `   Indicaciones: ${item.indications}\n`;
        }

        texto += "\n";
      });
    }

    if (receta.generalIndications) {
      texto += "Indicaciones generales:\n";
      texto += `${receta.generalIndications}\n\n`;
    }

    texto += "Puedes escribir *menu* para volver al menú principal.";

    return texto.trim();
  }

  _nombreMedicoDesdeReceta(receta) {
    const doctor = receta.medicalAttention?.doctor;
    const user = doctor?.user;

    if (user) {
      const nombre = [
        user.firstName,
        user.lastName
      ].filter(Boolean).join(" ");

      if (nombre) return nombre;
    }

    if (doctor?.professionalRegistry) {
      return `Médico registro ${doctor.professionalRegistry}`;
    }

    return "Médico no registrado";
  }

  _formatearFechaReceta(valor) {
    if (!valor) return "Fecha no registrada";

    const fecha = new Date(valor);

    if (isNaN(fecha.getTime())) {
      return String(valor);
    }

    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const dd = String(fecha.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
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