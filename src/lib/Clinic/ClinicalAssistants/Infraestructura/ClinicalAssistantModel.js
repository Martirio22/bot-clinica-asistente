const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class ClinicalAssistantModel extends Model {}

ClinicalAssistantModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: "user_id"
  },
  canManageChat: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "can_manage_chat"
  },
  canScheduleAppointments: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "can_schedule"
  },
  canAuthorizeCare: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "can_authorize"
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
  tableName: "clinical_assistants"
});

module.exports = ClinicalAssistantModel;