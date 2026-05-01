const UserRole = require("../Dominio/Entidades/UserRole");
const UserRoleModel = require("./UserRoleModel");
class UserRoleRepositorySequelize {
  toDomain(model) { const p = model.toJSON ? model.toJSON() : model; return new UserRole({ id:p.id, userId:p.userId, roleId:p.roleId, isActive:p.isActive }); }
  async assign(userRole) {
    const [row] = await UserRoleModel.findOrCreate({ where: { userId: userRole.userId, roleId: userRole.roleId }, defaults: { isActive: true } });
    if (!row.isActive) await row.update({ isActive: true });
    return this.toDomain(row);
  }
  async findAll() { const rows = await UserRoleModel.findAll({ where: { isActive: true } }); return rows.map(r => this.toDomain(r)); }
  async findByUserId(userId) { const rows = await UserRoleModel.findAll({ where: { userId, isActive: true } }); return rows.map(r => this.toDomain(r)); }
  async findByUserIdAndRoleId(userId, roleId) { const row = await UserRoleModel.findOne({ where: { userId, roleId } }); return row ? this.toDomain(row) : null; }
  async remove(userId, roleId) { await UserRoleModel.update({ isActive: false }, { where: { userId, roleId } }); }
}
module.exports = UserRoleRepositorySequelize;
