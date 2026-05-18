const WLRepositorySequelize = require("../../WhatsAppLines/Infraestructura/WLRepositorySequelize");

const CrearWhatsappLine = require("../../WhatsAppLines/Aplicacion/CrearWhatsappLine");
const ListarWhatsappLine = require("../../WhatsAppLines/Aplicacion/ListarWhatsappLine");
const ObtenerWhatsappLinePorId = require("../../WhatsAppLines/Aplicacion/ObtenerWhatsappLinePorId");
const ActualizarWhatsappLine = require("../../WhatsAppLines/Aplicacion/ActualizarWhatsappLine");
const EliminarWhatsappLine = require("../../WhatsAppLines/Aplicacion/EliminarWhatsappLine");

const WhatsappLineController = require("../../WhatsAppLines/Infraestructura/http/WhatsappLineController");
const WhatsappLineRoutes = require("../../WhatsAppLines/Infraestructura/http/WhatsappLineRoutes");

module.exports = function registerChatBotSqlModule(app) {
  const whatsappLineRepository = new WLRepositorySequelize();

  const whatsappLineController = new WhatsappLineController({
    crear: new CrearWhatsappLine(whatsappLineRepository),
    listar: new ListarWhatsappLine(whatsappLineRepository),
    obtener: new ObtenerWhatsappLinePorId(whatsappLineRepository),
    actualizar: new ActualizarWhatsappLine(whatsappLineRepository),
    eliminar: new EliminarWhatsappLine(whatsappLineRepository)
  });

  app.use("/api/chatbotsql/whatsapp-lines", WhatsappLineRoutes(whatsappLineController));
};
