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

module.exports = function registerChatBotModule(app) {
  const chatMessageRepository = new ChatMessageRepositoryMongoose();
  const deliveryRepository = new MessageDeliveryLogRepositoryMongoose();
  const rawEventRepository = new WhatsappRawEventRepository();

  const chatMessageController = new ChatMessageController({
    crear: new CrearChatMessage(chatMessageRepository),
    listarPorSession: new ListarChatMessagesPorSession(chatMessageRepository)
  });

  const deliveryController = new MessageDeliveryLogController({
    crear: new CrearMessageDeliveryLog(deliveryRepository, chatMessageRepository),
    listarPorMessage: new ListarLogsPorChatMessage(deliveryRepository)
  });

  const webhookController = new WebhookController({
    recibirWhatsappWebhook: new RecibirWhatsappWebhook(rawEventRepository, chatMessageRepository)
  });

  app.use("/api/chatbot/chat-messages", ChatMessageRoutes(chatMessageController));
  app.use("/api/chatbot/message-delivery-logs", MessageDeliveryLogRoutes(deliveryController));
  app.use("/api/chatbot/webhooks", WebhookRoutes(webhookController));
};
