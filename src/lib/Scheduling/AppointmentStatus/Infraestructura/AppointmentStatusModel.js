const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class AppointmentStatusModel extends Model {}

AppointmentStatusModel.init({
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
  tableName: "appointment_status"
});

module.exports = AppointmentStatusModel;