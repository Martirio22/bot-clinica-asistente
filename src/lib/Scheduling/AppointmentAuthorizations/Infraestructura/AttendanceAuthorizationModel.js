const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class AttendanceAuthorizationModel extends Model {}

AttendanceAuthorizationModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: "appointment_id"
  },
  isAuthorized: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: "is_authorized"
  },
  authorizationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "authorization_date"
  },
  authorizedByUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "authorized_by_user_id"
  },
  reason: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  observation: {
    type: DataTypes.STRING(500),
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
  tableName: "attendance_authorizations"
});

module.exports = AttendanceAuthorizationModel;