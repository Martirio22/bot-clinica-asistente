const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres"); // Mantengo tu ruta de conexión base

class ChatSessionModel extends Model {}

ChatSessionModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "patient_id"
  },
  whatsappLineId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "whatsapp_line_id"
  },
  sessionStatusId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "session_status_id"
  },
  patientWhatsappNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "patient_whatsapp_number"
  },
  patientWhatsappName: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: "patient_whatsapp_name"
  },
  handledByBot: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "handled_by_bot"
  },
  assignedAssistantId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "assigned_assistant_id"
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "start_date"
  },
  humanAssignmentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "human_assignment_date"
  },
  closeDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "close_date"
  },
  closeReason: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: "close_reason"
  },
  conversationSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: "conversation_summary"
  }
}, {
  sequelize,
  schema: "chatbot",
  tableName: "chat_sessions"
});

module.exports = ChatSessionModel;