const BotMenuModel = require("../BotMenus/Infraestructura/BotMenuModel");
const ChatSessionStatusModel = require("../ChatSessionStatus/Infraestructura/ChatSessionStatusModel");
const MessageTypeModel = require("../MessageTypes/Infraestructura/MessageTypeModel");
const BotIntentModel = require("../BotIntents/Infraestructura/BotIntentModel");

async function seedBotMenus() {
  const menus = [
    { code: "MENU_PRINCIPAL", name: "Menú principal", message: "Bienvenido a Clínica Central. ¿En qué podemos ayudarte? Selecciona una opción del menú:", isMainMenu: true },
    { code: "MENU_ESPECIALIDADES", name: "Menú de especialidades", message: "Selecciona la especialidad médica para tu cita:", isMainMenu: false },
    { code: "MENU_MEDICOS", name: "Menú de Médicos", message: "Selecciona el médico de tu preferencia:", isMainMenu: false },
    { code: "MENU_HORARIOS", name: "Menú de Horarios Disponibles", message: "Selecciona el horario que mejor se adapte a ti:", isMainMenu: false },
    { code: "MENU_ASISTENTE", name: "Transferencia a asistente", message: "Te asignaremos un asistente clínico para ayudarte de forma personalizada. Por favor espera un momento.", isMainMenu: false }
  ];

  for (const menu of menus) {
    await BotMenuModel.findOrCreate({
      where: { code: menu.code },
      defaults: menu
    });
  }

  const statuses = [
    { code: "BOT_ACTIVO", name: "Bot activo", description: "El paciente está siendo atendido por el bot." },
    { code: "ESPERANDO_ASISTENTE", name: "Esperando asistente", description: "El paciente solicitó atención humana y espera asignación." },
    { code: "ATENCION_HUMANA", name: "Atención humana", description: "Un asistente clínico está atendiendo al paciente." },
    { code: "CERRADA", name: "Cerrada", description: "La sesión de chat fue cerrada." },
    { code: "TRANSFERIDA_BOT", name: "Transferida al bot", description: "El asistente devolvió la conversación al bot." }
  ];

  for (const status of statuses) {
    await ChatSessionStatusModel.findOrCreate({
      where: { code: status.code },
      defaults: status
    });
  }

  const messageTypes = [
    { code: "ENTRANTE", name: "Entrante", description: "Mensaje enviado por el paciente desde WhatsApp." },
    { code: "SALIENTE", name: "Saliente", description: "Mensaje enviado hacia el paciente." },
    { code: "INTERNO", name: "Interno", description: "Nota interna del asistente o sistema." },
    { code: "EVENTO", name: "Evento", description: "Evento automático del sistema o del bot." }
  ];

  for (const type of messageTypes) {
    await MessageTypeModel.findOrCreate({
      where: { code: type.code },
      defaults: type
    });
  }

  const intents = [
    { code: "INFO_CLINICA", name: "Información de la clínica", description: "El paciente solicita información general de la clínica." },
    { code: "AGENDAR_CITA", name: "Agendar cita", description: "El paciente desea reservar una cita médica." },
    { code: "CONSULTAR_CITAS", name: "Consultar citas", description: "El paciente desea consultar sus citas pasadas o futuras." },
    { code: "CONSULTAR_RECETA", name: "Consultar receta", description: "El paciente solicita una receta médica emitida." },
    { code: "DERIVAR_ESPECIALISTA", name: "Derivar especialista", description: "La IA sugiere una especialidad según síntomas." },
    { code: "TRANSFERIR_HUMANO", name: "Transferir a humano", description: "El paciente solicita atención personalizada por asistente." }
  ];

  for (const intent of intents) {
    await BotIntentModel.findOrCreate({
      where: { code: intent.code },
      defaults: intent
    });
  }
}

module.exports = seedBotMenus;