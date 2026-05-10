const SecurityUser = require("../Dominio/Entidades/SecurityUser");
const SecurityUserModel = require("./UserModel");
const RoleModel = require("../../Roles/Infraestructura/RoleModel");

class UserRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new SecurityUser({
      id: plain.id,
      firstName: plain.firstName,
      lastName: plain.lastName,
      email: plain.email,
      username: plain.username,
      passwordHash: plain.passwordHash,
      phone: plain.phone,
      isActive: plain.isActive,
      roles: plain.roles || []
    });
  }
  async create(user) {
    const created = await SecurityUserModel.create({
      firstName: user.firstName, lastName: user.lastName, email: user.email,
      username: user.username, passwordHash: user.passwordHash, phone: user.phone,
      isActive: user.isActive
    });
    return this.toDomain(created);
  }
  async update(id, data) {
    await SecurityUserModel.update(data, { where: { id } });
    return await this.findById(id);
  }
  async softDelete(id) {
    await SecurityUserModel.update({ isActive: false }, { where: { id } });
  }
  async findById(id) {
    const user = await SecurityUserModel.findByPk(id, { include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }] });
    return user ? this.toDomain(user) : null;
  }
  async findByUsernameOrEmail(value) {
    const { Op } = require("sequelize");
    const user = await SecurityUserModel.findOne({ where: { [Op.or]: [{ username: value }, { email: value }] }, include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }] });
    return user ? this.toDomain(user) : null;
  }
  async findByEmail(email) {
    const user = await SecurityUserModel.findOne({ where: { email } });
    return user ? this.toDomain(user) : null;
  }
  async findByUsername(username) {
    const user = await SecurityUserModel.findOne({ where: { username } });
    return user ? this.toDomain(user) : null;
  }
  async findAll() {
    const users = await SecurityUserModel.findAll({ include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }], order: [["createdAt", "DESC"]] });
    return users.map(u => this.toDomain(u));
  }
  //se agrega
  async findByRoleCode(roleCode) {
  const users = await SecurityUserModel.findAll({
    where: { isActive: true },
    include: [ { model: RoleModel,  as: "roles", where: { code: roleCode }, through: { attributes: [] } } ]
  });

  return users.map(user => this.toDomain(user));
}
}
module.exports = UserRepositorySequelize;
