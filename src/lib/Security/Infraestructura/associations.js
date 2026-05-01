const SecurityUserModel = require("../Users/Infraestructura/UserModel");
const RoleModel = require("../Roles/Infraestructura/RoleModel");
const UserRoleModel = require("../UserRoles/Infraestructura/UserRoleModel");
const RefreshTokenModel = require("../Auth/Infraestructura/RefreshTokenModel");

function setupSecurityAssociations() {
  SecurityUserModel.belongsToMany(RoleModel, {
    through: UserRoleModel,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles"
  });

  RoleModel.belongsToMany(SecurityUserModel, {
    through: UserRoleModel,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users"
  });

  UserRoleModel.belongsTo(SecurityUserModel, { foreignKey: "userId", as: "user" });
  UserRoleModel.belongsTo(RoleModel, { foreignKey: "roleId", as: "role" });

  SecurityUserModel.hasMany(RefreshTokenModel, { foreignKey: "userId", as: "refreshTokens" });
  RefreshTokenModel.belongsTo(SecurityUserModel, { foreignKey: "userId", as: "user" });
}
module.exports = setupSecurityAssociations;
