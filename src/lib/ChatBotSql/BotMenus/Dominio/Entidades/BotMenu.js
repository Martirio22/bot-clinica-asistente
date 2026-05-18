class BotMenu {
  constructor({
    id,
    code,
    name,
    message,
    isMainMenu = false,
    isActive = true
  }) {
    if (!code) throw new Error("El codigo es requerido");
    if (!name) throw new Error("El nombre es requerido");
    if (!message) throw new Error("El mensaje es requerido");

    this.id = id;
    this.code = code.trim().toUpperCase();
    this.name = name.trim();
    this.message = message.trim();
    this.isMainMenu = isMainMenu;
    this.isActive = isActive;
  }
}

module.exports = BotMenu;