const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class DoctorModel extends Model {}

DoctorModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "user_id",
    unique: true
  },
  specialtyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "specialty_id"
  },
  professionalRegistry: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "professional_registry"
  },
  appointmentDurationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    field: "appointment_min"
  },
  attendsWhatsApp: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "attends_whatsapp"
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
  tableName: "doctors"
});

module.exports = DoctorModel;