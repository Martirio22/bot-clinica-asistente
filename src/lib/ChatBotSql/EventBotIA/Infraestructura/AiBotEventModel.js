const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class AiBotEventModel extends Model {}

AiBotEventModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  chatSessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "chat_session_id"
  },
  botIntentId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "bot_intent_id"
  },
  userText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: "user_text"
  },
  aiResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: "ai_response"
  },
  suggestedSpecialtyId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "suggested_specialty_id"
  },
  confidenceLevel: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: "confidence_level"
  },
  requiresHuman: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: "requires_human"
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "event_date"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "Estado"
  }
}, {
  sequelize,
  schema: "chatbot",
  tableName: "ai_bot_events"
});

module.exports = AiBotEventModel;