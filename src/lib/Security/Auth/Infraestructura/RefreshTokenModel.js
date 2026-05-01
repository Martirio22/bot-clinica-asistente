const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");
class RefreshTokenModel extends Model {}
RefreshTokenModel.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
  tokenHash: { type: DataTypes.STRING(500), allowNull: false, field: "token_hash" },
  ipAddress: { type: DataTypes.STRING(100), allowNull: true, field: "ip_address" },
  userAgent: { type: DataTypes.TEXT, allowNull: true, field: "user_agent" },
  revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false, field: "expires_at" },
  revokedAt: { type: DataTypes.DATE, allowNull: true, field: "revoked_at" }
}, { sequelize, schema: "security", tableName: "refresh_tokens" });
module.exports = RefreshTokenModel;
