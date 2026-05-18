const BotMenuModel = require("../BotMenus/Infraestructura/BotMenuModel");
const BotMenuOptionModel = require("../BotMenuOptions/Infraestructura/BotMenuOptionModel");

function setupChatBotAssociations() {
  BotMenuModel.hasMany(BotMenuOptionModel, { foreignKey: "menuBotId", as: "options" });
  BotMenuOptionModel.belongsTo(BotMenuModel, { foreignKey: "menuBotId", as: "parentMenu" });
  BotMenuOptionModel.belongsTo(BotMenuModel, { foreignKey: "targetMenuId", as: "targetMenu" });
}

module.exports = setupChatBotAssociations;