const WLRepositorySequelize = require("../../WhatsAppLines/Infraestructura/WLRepositorySequelize");
const BotMenuRepositorySequelize = require("../../BotMenus/Infraestructura/BotMenuRepositorySequelize");
const BMORepositorySequelize = require("../../BotMenuOptions/Infraestructura/BMORepositorySequelize");
const CSSRepositorySequelize = require("../../ChatSessionStatus/Infraestructura/CSSRepositorySequelize");
const MessageTypeRepositorySequelize = require("../../MessageTypes/Infraestructura/MessageTypeRepositorySequelize");
const BotIntentRepositorySequelize = require("../../BotIntents/Infraestructura/BotIntentRepositorySequelize");
const ChatSessionsRepositorySequelize = require("../../ChatSessions/Infraestructura/ChatSessionRepositorySequelize");
const AiBotEventRepositorySequelize = require("../../EventBotIA/Infraestructura/AiBotEventRepositorySequelize");

const CrearWhatsappLine = require("../../WhatsAppLines/Aplicacion/CrearWhatsappLine");
const ListarWhatsappLine = require("../../WhatsAppLines/Aplicacion/ListarWhatsappLine");
const ObtenerWhatsappLinePorId = require("../../WhatsAppLines/Aplicacion/ObtenerWhatsappLinePorId");
const ActualizarWhatsappLine = require("../../WhatsAppLines/Aplicacion/ActualizarWhatsappLine");
const EliminarWhatsappLine = require("../../WhatsAppLines/Aplicacion/EliminarWhatsappLine");

const CrearBotMenu = require("../../BotMenus/Aplicacion/CrearBotMenu");
const ListarBotMenu = require("../../BotMenus/Aplicacion/ListarBotMenu");
const ObtenerBotMenuPorId = require("../../BotMenus/Aplicacion/ObtenerBotMenuPorId");
const ActualizarBotMenu = require("../../BotMenus/Aplicacion/ActualizarBotMenu");
const EliminarBotMenu = require("../../BotMenus/Aplicacion/EliminarBotMenu");
const ObtenerBotMenuPrincipal = require("../../BotMenus/Aplicacion/ObtenerBotMenuPrincipal");

const CrearBotMenuOption = require("../../BotMenuOptions/Aplicacion/CrearBotMenuOption");
const ListarBotMenuOptionsPorMenu = require("../../BotMenuOptions/Aplicacion/ListarBotMenuOptionsPorMenu");
const ObtenerBotMenuOptionPorId = require("../../BotMenuOptions/Aplicacion/ObtenerBotMenuOptionPorId");
const ActualizarBotMenuOption = require("../../BotMenuOptions/Aplicacion/ActualizarBotMenuOption");
const EliminarBotMenuOption = require("../../BotMenuOptions/Aplicacion/EliminarBotMenuOption");

const CrearChatSessionStatus = require("../../ChatSessionStatus/Aplicacion/CrearChatSessionStatus");
const ListarChatSessionStatus = require("../../ChatSessionStatus/Aplicacion/ListarChatSessionStatus");
const ObtenerChatSessionStatusPorId = require("../../ChatSessionStatus/Aplicacion/ObtenerChatSessionStatusPorId");
const ActualizarChatSessionStatus = require("../../ChatSessionStatus/Aplicacion/ActualizarChatSessionStatus");
const EliminarChatSessionStatus = require("../../ChatSessionStatus/Aplicacion/EliminarChatSessionStatus");
const ObtenerChatSessionStatusPorCode = require("../../ChatSessionStatus/Aplicacion/ObtenerChatSessionStatusPorCode");

const CrearMessageType = require("../../MessageTypes/Aplicacion/CrearMessageType");
const ListarMessageType = require("../../MessageTypes/Aplicacion/ListarMessageType");
const ObtenerMessageTypePorId = require("../../MessageTypes/Aplicacion/ObtenerMessageTypePorId");
const ActualizarMessageType = require("../../MessageTypes/Aplicacion/ActualizarMessageType");
const EliminarMessageType = require("../../MessageTypes/Aplicacion/EliminarMessageType");
const ObtenerMessageTypePorCode = require("../../MessageTypes/Aplicacion/ObtenerMessageTypePorCode");

const CrearBotIntent = require("../../BotIntents/Aplicacion/CrearBotIntent");
const ListarBotIntent = require("../../BotIntents/Aplicacion/ListarBotIntent");
const ObtenerBotIntentPorId = require("../../BotIntents/Aplicacion/ObtenerBotIntentPorId");
const ActualizarBotIntent = require("../../BotIntents/Aplicacion/ActualizarBotIntent");
const EliminarBotIntent = require("../../BotIntents/Aplicacion/EliminarBotIntent");
const ObtenerBotIntentPorCode = require("../../BotIntents/Aplicacion/ObtenerBotIntentPorCode");

const CrearChatSession = require("../../ChatSessions/Aplicacion/CrearChatSession");
const ListarChatSessions = require("../../ChatSessions/Aplicacion/ListarChatSessions");
const ObtenerChatSessionPorId = require("../../ChatSessions/Aplicacion/ObtenerChatSessionPorId");
const AsignarAsistenteHumano = require("../../ChatSessions/Aplicacion/AsignarAsistenteHumano");
const CerrarChatSession = require("../../ChatSessions/Aplicacion/CerrarChatSession");

const CrearAiBotEvent = require("../../EventBotIA/Aplicacion/CrearAiBotEvent");
const ListarAiBotEvents = require("../../EventBotIA/Aplicacion/ListarAiBotEvents");
const ObtenerAiBotEventPorId = require("../../EventBotIA/Aplicacion/ObtenerAiBotEventPorId");
const ActualizarAiBotEvent = require("../../EventBotIA/Aplicacion/ActualizarAiBotEvent");
const EliminarAiBotEvent = require("../../EventBotIA/Aplicacion/EliminarAiBotEvent");

const WhatsappLineController = require("../../WhatsAppLines/Infraestructura/http/WhatsappLineController");
const WhatsappLineRoutes = require("../../WhatsAppLines/Infraestructura/http/WhatsappLineRoutes");
const BotMenuController = require("../../BotMenus/Infraestructura/http/BotMenuController");
const BotMenuRoutes = require("../../BotMenus/Infraestructura/http/BotMenuRoutes");
const BotMenuOptionController = require("../../BotMenuOptions/Infraestructura/http/BotMenuOptionController");
const BotMenuOptionRoutes = require("../../BotMenuOptions/Infraestructura/http/BotMenuOptionRoutes");
const ChatSessionStatusController = require("../../ChatSessionStatus/Infraestructura/http/ChatSessionStatusController");
const ChatSessionStatusRoutes = require("../../ChatSessionStatus/Infraestructura/http/ChatSessionStatusRoutes");
const MessageTypeController = require("../../MessageTypes/Infraestructura/http/MessageTypeController");
const MessageTypeRoutes = require("../../MessageTypes/Infraestructura/http/MessageTypeRoutes");
const BotIntentController = require("../../BotIntents/Infraestructura/http/BotIntentController");
const BotIntentRoutes = require("../../BotIntents/Infraestructura/http/BotIntentRoutes");
const ChatSessionController = require("../../ChatSessions/Infraestructura/http/ChatSessionController");
const ChatSessionRoutes = require("../../ChatSessions/Infraestructura/http/ChatSessionRoutes");
const AiBotEventController = require("../../EventBotIA/Infraestructura/http/AiBotEventController");
const AiBotEventRoutes = require("../../EventBotIA/Infraestructura/http/AiBotEventRoutes");

module.exports = function registerChatBotSqlModule(app) {
  const whatsappLineRepository = new WLRepositorySequelize();
  const botMenuRepository = new BotMenuRepositorySequelize();
  const botMenuOptionRepository = new BMORepositorySequelize();
  const chatSessionStatusRepository = new CSSRepositorySequelize();
  const messageTypeRepository = new MessageTypeRepositorySequelize();
  const botIntentRepository = new BotIntentRepositorySequelize();
  const chatSessionRepository = new ChatSessionsRepositorySequelize();
  const aiBotEventRepository = new AiBotEventRepositorySequelize();

  const whatsappLineController = new WhatsappLineController({
    crear: new CrearWhatsappLine(whatsappLineRepository),
    listar: new ListarWhatsappLine(whatsappLineRepository),
    obtener: new ObtenerWhatsappLinePorId(whatsappLineRepository),
    actualizar: new ActualizarWhatsappLine(whatsappLineRepository),
    eliminar: new EliminarWhatsappLine(whatsappLineRepository)
  });

  const botMenuController = new BotMenuController({
    crear: new CrearBotMenu(botMenuRepository),
    listar: new ListarBotMenu(botMenuRepository),
    obtener: new ObtenerBotMenuPorId(botMenuRepository),
    actualizar: new ActualizarBotMenu(botMenuRepository),
    eliminar: new EliminarBotMenu(botMenuRepository),
    obtenerPrincipal: new ObtenerBotMenuPrincipal(botMenuRepository)
  });

  const botMenuOptionController = new BotMenuOptionController({
    crear: new CrearBotMenuOption(botMenuOptionRepository),
    listarPorMenu: new ListarBotMenuOptionsPorMenu(botMenuOptionRepository),
    obtener: new ObtenerBotMenuOptionPorId(botMenuOptionRepository),
    actualizar: new ActualizarBotMenuOption(botMenuOptionRepository),
    eliminar: new EliminarBotMenuOption(botMenuOptionRepository)
  });

  const chatSessionStatusController = new ChatSessionStatusController({
    crear: new CrearChatSessionStatus(chatSessionStatusRepository),
    listar: new ListarChatSessionStatus(chatSessionStatusRepository),
    obtener: new ObtenerChatSessionStatusPorId(chatSessionStatusRepository),
    actualizar: new ActualizarChatSessionStatus(chatSessionStatusRepository),
    eliminar: new EliminarChatSessionStatus(chatSessionStatusRepository),
    obtenerPorCodigo: new ObtenerChatSessionStatusPorCode(chatSessionStatusRepository)
  });

  const messageTypeController = new MessageTypeController({
    crear: new CrearMessageType(messageTypeRepository),
    listar: new ListarMessageType(messageTypeRepository),
    obtener: new ObtenerMessageTypePorId(messageTypeRepository),
    actualizar: new ActualizarMessageType(messageTypeRepository),
    eliminar: new EliminarMessageType(messageTypeRepository),
    obtenerPorCodigo: new ObtenerMessageTypePorCode(messageTypeRepository)
  });

  const botIntentController = new BotIntentController({
    crear: new CrearBotIntent(botIntentRepository),
    listar: new ListarBotIntent(botIntentRepository),
    obtener: new ObtenerBotIntentPorId(botIntentRepository),
    actualizar: new ActualizarBotIntent(botIntentRepository),
    eliminar: new EliminarBotIntent(botIntentRepository),
    obtenerPorCodigo: new ObtenerBotIntentPorCode(botIntentRepository)
  });

  const chatSessionController = new ChatSessionController({
    crear: new CrearChatSession(chatSessionRepository),
    listar: new ListarChatSessions(chatSessionRepository),
    obtener: new ObtenerChatSessionPorId(chatSessionRepository),
    asignarAsistente: new AsignarAsistenteHumano(chatSessionRepository),
    cerrar: new CerrarChatSession(chatSessionRepository)
  });

  const aiBotEventController = new AiBotEventController({
    crear: new CrearAiBotEvent(aiBotEventRepository),
    listar: new ListarAiBotEvents(aiBotEventRepository),
    obtener: new ObtenerAiBotEventPorId(aiBotEventRepository),
    actualizar: new ActualizarAiBotEvent(aiBotEventRepository),
    eliminar: new EliminarAiBotEvent(aiBotEventRepository)
  });

  app.use("/api/chatbotsql/whatsapp-lines", WhatsappLineRoutes(whatsappLineController));
  app.use("/api/chatbotsql/bot-menus", BotMenuRoutes(botMenuController));
  app.use("/api/chatbotsql/bot-menu-options", BotMenuOptionRoutes(botMenuOptionController));
  app.use("/api/chatbotsql/chat-session-statuses", ChatSessionStatusRoutes(chatSessionStatusController));
  app.use("/api/chatbotsql/message-types", MessageTypeRoutes(messageTypeController));
  app.use("/api/chatbotsql/bot-intents", BotIntentRoutes(botIntentController));
  app.use("/api/chatbotsql/chat-sessions", ChatSessionRoutes(chatSessionController));
  app.use("/api/chatbotsql/ai-bot-events", AiBotEventRoutes(aiBotEventController));
};
