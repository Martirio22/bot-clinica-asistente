const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class ScheduleBlockTypeModel extends Model {}

ScheduleBlockTypeModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },

  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  description: {
    type: DataTypes.STRING(300),
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
  schema: "scheduling",
  tableName: "schedule_block_types"
});

module.exports = ScheduleBlockTypeModel;