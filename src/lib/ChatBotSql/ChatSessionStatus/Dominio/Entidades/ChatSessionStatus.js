class ChatSessionStatus {
  constructor({
    id,
    code,
    name,
    description = null,
    isActive = true
  }) {
    if (!code) throw new Error("El código de estado es requerido");
    if (!name) throw new Error("El nombre de estado es requerido");

    this.id = id;
    this.code = code.trim().toUpperCase();
    this.name = name.trim();
    this.description = description;
    this.isActive = isActive;
  }
}

module.exports = ChatSessionStatus;