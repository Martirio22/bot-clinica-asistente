class Office {
    constructor({
    id,
    branchId,
    code,
    name,
    floor = null,
    isActive = true
  }){
    if (!branchId) throw new Error("id de sucursal requerido");
    if (!code) throw new Error("codido de consultorio requerido");
    if (!name) throw new Error("nombre requerido");

    this.id = id;
    this.branchId = branchId;
    this.code = code.trim().toUpperCase();
    this.name = name.trim();
    this.floor = floor;
    this.isActive = isActive;
  }
}

module.exports = Office;