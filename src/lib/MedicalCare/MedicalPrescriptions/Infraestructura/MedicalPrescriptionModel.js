const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class MedicalPrescriptionModel extends Model {}

MedicalPrescriptionModel.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  medicalAttentionId: { type: DataTypes.UUID, allowNull: false, unique: true, field: "medical_attention_id" },
  prescriptionCode: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: "code" },
  issueDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "issue_Date" },
  generalIndications: { type: DataTypes.TEXT, allowNull: true, field: "general_Indications" },
  isSentWhatsapp: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_Sent_Whatsapp" },
  whatsappSentDate: { type: DataTypes.DATE, allowNull: true, field: "whatsapp_Sent_Date" },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" }
}, {
  sequelize,
  schema: "medicalcare",
  tableName: "medical_prescription"
});

module.exports = MedicalPrescriptionModel;