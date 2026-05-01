class Role {
  constructor({ id, code, name, description = null, isActive = true }) {
    if (!code) throw new Error("código de rol requerido");
    if (!name) throw new Error("nombre de rol requerido");
    this.id = id;
    this.code = code.trim().toUpperCase();
    this.name = name.trim();
    this.description = description;
    this.isActive = isActive;
  }
  canBeAssigned() { return this.isActive === true; }
}
module.exports = Role;
