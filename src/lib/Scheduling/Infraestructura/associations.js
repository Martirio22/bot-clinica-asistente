const DoctorScheduleModel = require("../DoctorSchedules/Infraestructura/DoctorScheduleModel");
const DoctorModel = require("../../Clinic/Doctors/Infraestructura/DoctorModel");
const BranchModel = require("../../Clinic/Branches/Infraestructura/BranchModel");
const OfficeModel = require("../../Clinic/Offices/Infraestructura/OfficeModel");
const ScheduleBlockModel = require("../DoctorScheduleBlocks/Infraestructura/ScheduleBlockModel");
const ScheduleBlockTypeModel = require("../ScheduleBlockType/Infraestructura/ScheduleBlockTypeModel");
const UserModel = require("../../Security/Users/Infraestructura/UserModel");

function setupSchedulingAssociations() {
  DoctorScheduleModel.belongsTo(DoctorModel, { foreignKey: "doctorId", as: "doctor" });
  DoctorScheduleModel.belongsTo(BranchModel, { foreignKey: "branchId", as: "branch" });
  DoctorScheduleModel.belongsTo(OfficeModel, { foreignKey: "officeId", as: "office" });

  DoctorModel.hasMany(DoctorScheduleModel, { foreignKey: "doctorId", as: "schedules" });

  //AgendaBloqueo
  ScheduleBlockModel.belongsTo(DoctorModel, { foreignKey: "doctorId", as: "doctor" });
  ScheduleBlockModel.belongsTo(ScheduleBlockTypeModel, { foreignKey: "blockingTypeId", as: "blockingType" });
  ScheduleBlockModel.belongsTo(UserModel, { foreignKey: "registeredByUserId", as: "user" });
  
  DoctorModel.hasMany(ScheduleBlockModel, { foreignKey: "doctorId", as: "blockings" });
  ScheduleBlockTypeModel.hasMany(ScheduleBlockModel, { foreignKey: "blockingTypeId", as: "blockings" });
}

module.exports = setupSchedulingAssociations;

