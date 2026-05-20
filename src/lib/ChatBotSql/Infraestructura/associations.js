const BotMenuModel = require("../BotMenus/Infraestructura/BotMenuModel");
const BotMenuOptionModel = require("../BotMenuOptions/Infraestructura/BotMenuOptionModel");
const ChatSessionModel = require("../ChatSessions/Infraestructura/ChatSessionModel");
const WhatsappLineModel = require("../WhatsAppLines/Infraestructura/WhatsappLineModel");
const ChatSessionStatusModel = require("../ChatSessionStatus/Infraestructura/ChatSessionStatusModel");
const PatientModel = require("../../Clinic/Patients/Infraestructura/PatientModel"); 
const AssistantModel = require("../../Clinic/ClinicalAssistants/Infraestructura/ClinicalAssistantModel");

function setupChatBotAssociations() {
  BotMenuModel.hasMany(BotMenuOptionModel, { foreignKey: "menuBotId", as: "options" });
  BotMenuOptionModel.belongsTo(BotMenuModel, { foreignKey: "menuBotId", as: "parentMenu" });
  BotMenuOptionModel.belongsTo(BotMenuModel, { foreignKey: "targetMenuId", as: "targetMenu" });

  ChatSessionModel.belongsTo(WhatsappLineModel, { foreignKey: "whatsappLineId", as: "whatsappLine" });
  ChatSessionModel.belongsTo(ChatSessionStatusModel, { foreignKey: "sessionStatusId", as: "status" });
  ChatSessionModel.belongsTo(PatientModel, { foreignKey: "patientId", as: "patient" });
  ChatSessionModel.belongsTo(AssistantModel, { foreignKey: "assignedAssistantId", as: "assignedAssistant" });

  // Relaciones inversas (HasMany)
  WhatsappLineModel.hasMany(ChatSessionModel, { foreignKey: "whatsappLineId", as: "sessions" });
  ChatSessionStatusModel.hasMany(ChatSessionModel, { foreignKey: "sessionStatusId", as: "sessions" });
  PatientModel.hasMany(ChatSessionModel, { foreignKey: "patientId", as: "chatSessions" });
  AssistantModel.hasMany(ChatSessionModel, { foreignKey: "assignedAssistantId", as: "assignedSessions" });
}

module.exports = setupChatBotAssociations;