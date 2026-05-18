class WhatsappLine {
  constructor({
    id,
    name,
    phone,
    description = null,
    isActive = true,
    isConnected = false,
    lastConnectionDate = null
  }) {
    if (!name) throw new Error("nombre requerido");
    if (!phone) throw new Error("numero de telefono requerido");

    this.id = id;
    this.name = name.trim();
    this.phone = phone.trim();
    this.description = description ? description.trim() : null;
    this.isActive = isActive;
    this.isConnected = isConnected;
    this.lastConnectionDate = lastConnectionDate;
  }
}

module.exports = WhatsappLine;