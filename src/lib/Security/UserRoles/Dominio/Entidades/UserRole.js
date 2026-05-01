class UserRole {
  constructor({ id, userId, roleId, isActive = true }) {
    if (!userId) throw new Error("userId requerido");
    if (!roleId) throw new Error("roleId requerido");
    this.id = id;
    this.userId = userId;
    this.roleId = roleId;
    this.isActive = isActive;
  }
}
module.exports = UserRole;
