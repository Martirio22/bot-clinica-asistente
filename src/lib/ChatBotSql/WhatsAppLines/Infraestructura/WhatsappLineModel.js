const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class WhatsappLineModel extends Model {}

WhatsappLineModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "is_active"
  },
  isConnected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: "is_connected"
  },
  lastConnectionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "last_connection_date"
  }
}, {
  sequelize,
  schema: "chatbot",
  tableName: "whatsapp_lines"
});

module.exports = WhatsappLineModel;