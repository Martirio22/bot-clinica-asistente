const ChatMessageRepositoryMongoose = require("../../ChatMessages/Infraestructura/ChatMessageRepositoryMongoose");
const CrearChatMessage = require("../../ChatMessages/Aplicacion/CrearChatMessage");
const ListarChatMessagesPorSession = require("../../ChatMessages/Aplicacion/ListarChatMessagesPorSession");
const ChatMessageController = require("../../ChatMessages/Infraestructura/http/ChatMessageController");
const ChatMessageRoutes = require("../../ChatMessages/Infraestructura/http/ChatMessageRoutes");

const MessageDeliveryLogRepositoryMongoose = require("../../MessageDeliveryLogs/Infraestructura/MessageDeliveryLogRepositoryMongoose");
const CrearMessageDeliveryLog = require("../../MessageDeliveryLogs/Aplicacion/CrearMessageDeliveryLog");
const ListarLogsPorChatMessage = require("../../MessageDeliveryLogs/Aplicacion/ListarLogsPorChatMessage");
const MessageDeliveryLogController = require("../../MessageDeliveryLogs/Infraestructura/http/MessageDeliveryLogController");
const MessageDeliveryLogRoutes = require("../../MessageDeliveryLogs/Infraestructura/http/MessageDeliveryLogRoutes");

const WhatsappRawEventRepository = require("../../Webhooks/Infraestructura/WhatsappRawEventRepository");
const RecibirWhatsappWebhook = require("../../Webhooks/Aplicacion/RecibirWhatsappWebhook");
const WebhookController = require("../../Webhooks/Infraestructura/http/WebhookController");
const WebhookRoutes = require("../../Webhooks/Infraestructura/http/WebhookRoutes");

const ConversationContextRepositoryMongoose = require("../../ConversationContexts/Infraestructura/ConversationContextRepositoryMongoose");
const ActualizarConversationContext = require("../../ConversationContexts/Aplicacion/ActualizarConversationContext");
const ObtenerConversationContextContextoPorSession = require("../../ConversationContexts/Aplicacion/ObtenerConversationContextContextoPorSession");
const ConversationContextController = require("../../ConversationContexts/Infraestructura/http/ConversationContextController");
const ConversationContextRoutes = require("../../ConversationContexts/Infraestructura/http/ConversationContextRoutes");

const BotLogRepositoryMongoose = require("../../BotLogs/Infraestructura/BotLogRepositoryMongoose");
const RegistrarBotLog = require("../../BotLogs/Aplicacion/RegistrarBotLog");
const ListarBotLogsPorSession = require("../../BotLogs/Aplicacion/ListarBotLogsPorSession");
const BotLogController = require("../../BotLogs/Infraestructura/http/BotLogController");
const BotLogRoutes = require("../../BotLogs/Infraestructura/http/BotLogRoutes");

const WebhookLogRepositoryMongoose = require("../../WebhookLogs/Infraestructura/WebhookLogRepositoryMongoose");

module.exports = function registerChatBotModule(app) {
  const chatMessageRepository = new ChatMessageRepositoryMongoose();
  const deliveryRepository = new MessageDeliveryLogRepositoryMongoose();
  const rawEventRepository = new WhatsappRawEventRepository();
  const contextRepository = new ConversationContextRepositoryMongoose();
  const botLogRepository = new BotLogRepositoryMongoose();
  const webhookLogRepository = new WebhookLogRepositoryMongoose();

  const chatMessageController = new ChatMessageController({
    crear: new CrearChatMessage(chatMessageRepository),
    listarPorSession: new ListarChatMessagesPorSession(chatMessageRepository)
  });

  const deliveryController = new MessageDeliveryLogController({
    crear: new CrearMessageDeliveryLog(deliveryRepository, chatMessageRepository),
    listarPorMessage: new ListarLogsPorChatMessage(deliveryRepository)
  });

  const contextController = new ConversationContextController({
    actualizar: new ActualizarConversationContext(contextRepository),
    obtenerPorSession: new ObtenerConversationContextContextoPorSession(contextRepository)
  });

  const botLogController = new BotLogController({
    registrar: new RegistrarBotLog(botLogRepository),
    listarPorSession: new ListarBotLogsPorSession(botLogRepository)
  });

  const webhookController = new WebhookController({
    recibirWhatsappWebhook: new RecibirWhatsappWebhook(rawEventRepository, chatMessageRepository, webhookLogRepository)
  });

  app.use("/api/chatbot/chat-messages", ChatMessageRoutes(chatMessageController));
  app.use("/api/chatbot/message-delivery-logs", MessageDeliveryLogRoutes(deliveryController));
  app.use("/api/chatbot/conversation-contexts", ConversationContextRoutes(contextController));
  app.use("/api/chatbot/bot-logs", BotLogRoutes(botLogController));
  app.use("/api/chatbot/webhooks", WebhookRoutes(webhookController));
};
