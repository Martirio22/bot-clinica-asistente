const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class MedicalAttentionModel extends Model {}

MedicalAttentionModel.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  appointmentId: { type: DataTypes.UUID, allowNull: false, unique: true, field: "appointment_id" },
  patientId: { type: DataTypes.UUID, allowNull: false, field: "patient_id" },
  doctorId: { type: DataTypes.UUID, allowNull: false, field: "doctor_id" },
  statusAttentionId: { type: DataTypes.UUID, allowNull: false, field: "status_attention_id" },
  startDate: { type: DataTypes.DATE, allowNull: false, field: "start_date" },
  endDate: { type: DataTypes.DATE, allowNull: true, field: "end_date" },
  reasonConsultation: { type: DataTypes.STRING(500), allowNull: true },
  symptoms: { type: DataTypes.TEXT, allowNull: true },
  diagnosis: { type: DataTypes.TEXT, allowNull: true },
  indications: { type: DataTypes.TEXT, allowNull: true },
  observations: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" }
}, {
  sequelize,
  schema: "medicalcare",
  tableName: "medical_attentions"
});

module.exports = MedicalAttentionModel;