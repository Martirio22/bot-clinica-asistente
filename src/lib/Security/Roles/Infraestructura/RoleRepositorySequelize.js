const Role = require("../Dominio/Entidades/Role");
const RoleModel = require("./RoleModel");
class RoleRepositorySequelize {
  toDomain(model) { const p = model.toJSON ? model.toJSON() : model; return new Role({ id:p.id, code:p.code, name:p.name, description:p.description, isActive:p.isActive }); }
  async create(role) { const created = await RoleModel.create({ code: role.code, name: role.name, description: role.description, isActive: role.isActive }); return this.toDomain(created); }
  async update(id, data) { await RoleModel.update(data, { where: { id } }); return await this.findById(id); }
  async softDelete(id) { await RoleModel.update({ isActive: false }, { where: { id } }); }
  async findById(id) { const r = await RoleModel.findByPk(id); return r ? this.toDomain(r) : null; }
  async findByCode(code) { const r = await RoleModel.findOne({ where: { code: code.toUpperCase() } }); return r ? this.toDomain(r) : null; }
  async findAll() { const rows = await RoleModel.findAll({ order: [["createdAt", "DESC"]] }); return rows.map(r => this.toDomain(r)); }
}
module.exports = RoleRepositorySequelize;
