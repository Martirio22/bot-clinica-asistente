class BotMenuOption {
  constructor({
    id,
    menuBotId,
    code,
    optionText,
    action,
    targetMenuId = null,
    order = 1,
    isActive = true,
    parentMenu = null,
    targetMenu = null
  }) {
    if (!menuBotId) throw new Error("La opción debe estar ligada a un menú origen (menuBotId)");
    if (!code) throw new Error("El código o número de opción es requerido");
    if (!optionText) throw new Error("El texto de la opción es requerido");
    if (!action) throw new Error("La acción de la opción es requerida");

    this.id = id;
    this.menuBotId = menuBotId;
    this.code = code.trim();
    this.optionText = optionText.trim();
    this.action = action.trim().toUpperCase();
    this.targetMenuId = targetMenuId;
    this.order = order;
    this.isActive = isActive;
    this.parentMenu = parentMenu;
    this.targetMenu = targetMenu;
  }
}

module.exports = BotMenuOption;