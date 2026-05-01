const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");
class SecurityUserModel extends Model {}
SecurityUserModel.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  firstName: { type: DataTypes.STRING(100), allowNull: false, field: "first_name" },
  lastName: { type: DataTypes.STRING(100), allowNull: false, field: "last_name" },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING(500), allowNull: false, field: "password_hash" },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" }
}, { sequelize, schema: "security", tableName: "users" });
module.exports = SecurityUserModel;
