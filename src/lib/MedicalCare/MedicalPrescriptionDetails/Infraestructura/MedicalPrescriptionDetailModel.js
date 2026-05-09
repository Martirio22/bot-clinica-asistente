const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class MedicalPrescriptionDetailModel extends Model {}

MedicalPrescriptionDetailModel.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  medicalPrescriptionId: { type: DataTypes.UUID, allowNull: false, field: "medical_prescription_id" },
  medicine: { type: DataTypes.STRING(200), allowNull: false },
  dose: { type: DataTypes.STRING(150), allowNull: false },
  frequency: { type: DataTypes.STRING(150), allowNull: false },
  duration: { type: DataTypes.STRING(150), allowNull: false },
  indications: { type: DataTypes.STRING(500), allowNull: true },
  order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" }
}, {
  sequelize,
  schema: "medicalcare",
  tableName: "medical_prescription_details"
});

module.exports = MedicalPrescriptionDetailModel;