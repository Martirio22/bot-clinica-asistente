const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class DoctorScheduleModel extends Model {}

DoctorScheduleModel.init({
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
  branchId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "branch_id"
  },
  officeId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "office_id"
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "day_of_week",
    validate: { min: 1, max: 7 }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: "start_time"
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: "end_time"
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
  tableName: "doctor_schedules"
});

module.exports = DoctorScheduleModel;