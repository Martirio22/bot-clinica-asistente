const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class BotMenuOptionModel extends Model {}

BotMenuOptionModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  menuBotId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "menu_bot_id"
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  optionText: {
    type: DataTypes.STRING(300),
    allowNull: false,
    field: "option_text"
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  targetMenuId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "MenuDestinoId"
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "is_active"
  }
}, {
  sequelize,
  schema: "chatbot",
  tableName: "bot_menu_options"
});

module.exports = BotMenuOptionModel;