const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class AppointmentModel extends Model {}

AppointmentModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  patientId: { type: DataTypes.UUID, allowNull: false, field: "patient_id" },
  doctorId: { type: DataTypes.UUID, allowNull: false, field: "doctor_id" },
  specialtyId: { type: DataTypes.UUID, allowNull: false, field: "specialty_id" },
  branchId: { type: DataTypes.UUID, allowNull: false, field: "branch_id" },
  officeId: { type: DataTypes.UUID, allowNull: true, field: "office_id" },
  statusId: { type: DataTypes.UUID, allowNull: false, field: "ap_status_id" },
  startDate: { type: DataTypes.DATE, allowNull: false, field: "start_date" },
  endDate: { type: DataTypes.DATE, allowNull: false, field: "end_date" },
  reason: { type: DataTypes.STRING(500), allowNull: true },
  origin: { type: DataTypes.STRING(50), defaultValue: 'WHATSAPP' },
  createdByUserId: { type: DataTypes.UUID, allowNull: true, field: "create_by_user_id" },
  isCreatedByBot: { type: DataTypes.BOOLEAN, defaultValue: false, field: "create_by_bot" },
  observation: { type: DataTypes.STRING(500), allowNull: true },
  isActive: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active"}
}, {
  sequelize,
  schema: "scheduling",
  tableName: "appointments"
});

module.exports = AppointmentModel;