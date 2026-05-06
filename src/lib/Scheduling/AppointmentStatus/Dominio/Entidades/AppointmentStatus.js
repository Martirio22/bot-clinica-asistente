class AppointmentStatus {
  constructor({
    id,
    code,
    name,
    description = null,
    isActive = true
  }) {
    if (!code) throw new Error("El codigo es requerido");
    if (!name) throw new Error("El nombre es requerido");

    this.id = id;
    this.code = code.trim();
    this.name = name.trim();
    this.description = description;
    this.isActive = isActive;
  }
}

module.exports = AppointmentStatus;