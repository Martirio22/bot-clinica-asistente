const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class OfficeModel extends Model {}

OfficeModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  branchId: {
  type: DataTypes.UUID,
  allowNull: false,
  field: "branch_id",
  references: {
    model: {
      tableName: "branches",
      schema: "clinic"
    },
    key: "id"
  },
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
},
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  floor: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "is_active"
  }
}, {
  sequelize,
  schema: "clinic",
  tableName: "offices"
});

module.exports = OfficeModel;