const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

class PatientModel extends Model {}

PatientModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    identificationType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "identification_type"
    },

    identification: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true
    },

    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name"
    },

    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name"
    },

    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "birth_date"
    },

    gender: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },

    whatsappPhone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      field: "whatsapp_phone"
    },

    address: {
      type: DataTypes.STRING(300),
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    schema: "clinic",
    tableName: "patients",
    timestamps: true
  }
);

module.exports = PatientModel;