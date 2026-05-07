const DoctorScheduleModel = require("../DoctorSchedules/Infraestructura/DoctorScheduleModel");
const DoctorModel = require("../../Clinic/Doctors/Infraestructura/DoctorModel");
const BranchModel = require("../../Clinic/Branches/Infraestructura/BranchModel");
const OfficeModel = require("../../Clinic/Offices/Infraestructura/OfficeModel");

function setupSchedulingAssociations() {
  DoctorScheduleModel.belongsTo(DoctorModel, { foreignKey: "doctorId", as: "doctor" });
  DoctorScheduleModel.belongsTo(BranchModel, { foreignKey: "branchId", as: "branch" });
  DoctorScheduleModel.belongsTo(OfficeModel, { foreignKey: "officeId", as: "office" });

  DoctorModel.hasMany(DoctorScheduleModel, { foreignKey: "doctorId", as: "schedules" });
}

module.exports = setupSchedulingAssociations;

