class Specialty {
  constructor({ id, code, name, description = null, isActive = true }) {
    if (!code) throw new Error("codigo requerido");
    if (!name) throw new Error("nombre requerido");

    this.id = id;
    this.code = code.trim();
    this.name = name.trim();
    this.description = description;
    this.isActive = isActive;
  }
}

module.exports = Specialty;