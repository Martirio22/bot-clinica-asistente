const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");
class UserRoleModel extends Model {}
UserRoleModel.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
  roleId: { type: DataTypes.UUID, allowNull: false, field: "role_id" },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" }
}, { sequelize, schema: "security", tableName: "user_roles", indexes: [{ unique: true, fields: ["user_id", "role_id"] }] });
module.exports = UserRoleModel;
