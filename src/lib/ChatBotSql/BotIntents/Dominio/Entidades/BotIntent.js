class BotIntent {
  constructor({
    id,
    code,
    name,
    description = null,
    isActive = true
  }) {
    if (!code) throw new Error("El código de la intención es requerido");
    if (!name) throw new Error("El nombre de la intención es requerido");

    this.id = id;
    this.code = code.trim().toUpperCase();
    this.name = name.trim();
    this.description = description;
    this.isActive = isActive;
  }
}

module.exports = BotIntent;