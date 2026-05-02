class Office {
    constructor({
    id,
    branchId,
    code,
    name,
    floor = null,
    isActive = true
  }){
    if (!branchId) throw new Error("branchId requerido");
    if (!code) throw new Error("code requerido");
    if (!name) throw new Error("name requerido");

    this.id = id;
    this.branchId = branchId;
    this.code = code.trim();
    this.name = name.trim();
    this.floor = floor;
    this.isActive = isActive;
  }
}

module.exports = Office;