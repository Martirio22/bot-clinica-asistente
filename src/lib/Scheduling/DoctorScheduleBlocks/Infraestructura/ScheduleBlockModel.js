const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class ScheduleBlockModel extends Model {}

ScheduleBlockModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "doctor_id"
  },
  blockingTypeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "blocking_type_id"
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "start_date"
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "end_date"
  },
  reason: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: "reason"
  },
  registeredByUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "registered_by_user_id"
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
  tableName: "schedule_blocks"
});

module.exports = ScheduleBlockModel;