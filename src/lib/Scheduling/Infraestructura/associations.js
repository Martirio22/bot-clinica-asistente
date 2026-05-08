const DoctorScheduleModel = require("../DoctorSchedules/Infraestructura/DoctorScheduleModel");
const DoctorModel = require("../../Clinic/Doctors/Infraestructura/DoctorModel");
const BranchModel = require("../../Clinic/Branches/Infraestructura/BranchModel");
const OfficeModel = require("../../Clinic/Offices/Infraestructura/OfficeModel");
const ScheduleBlockModel = require("../DoctorScheduleBlocks/Infraestructura/ScheduleBlockModel");
const ScheduleBlockTypeModel = require("../ScheduleBlockType/Infraestructura/ScheduleBlockTypeModel");
const UserModel = require("../../Security/Users/Infraestructura/UserModel");
const AppointmentModel = require("../Appointments/Infraestructura/AppointmentModel");
const PatientModel = require("../../Clinic/Patients/Infraestructura/PatientModel");
const SpecialtyModel = require("../../Clinic/Specialties/Infraestructura/SpecialtyModel");
const AppointmentStatusModel = require("../AppointmentStatus/Infraestructura/AppointmentStatusModel");
const AttendanceAuthorizationModel = require("../AppointmentAuthorizations/Infraestructura/AttendanceAuthorizationModel");

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

  //Citas
  AppointmentModel.belongsTo(PatientModel, { foreignKey: "patientId", as: "patient" });
  AppointmentModel.belongsTo(DoctorModel, { foreignKey: "doctorId", as: "doctor" });
  AppointmentModel.belongsTo(SpecialtyModel, { foreignKey: "specialtyId", as: "specialty" });
  AppointmentModel.belongsTo(BranchModel, { foreignKey: "branchId", as: "branch" });
  AppointmentModel.belongsTo(OfficeModel, { foreignKey: "officeId", as: "office" });
  AppointmentModel.belongsTo(AppointmentStatusModel, { foreignKey: "statusId", as: "status" });
  AppointmentModel.belongsTo(UserModel, { foreignKey: "createdByUserId", as: "creatorUser" });

  // Autorización Atencion
AttendanceAuthorizationModel.belongsTo(AppointmentModel, { foreignKey: "appointmentId", as: "appointment" });
AttendanceAuthorizationModel.belongsTo(UserModel, { foreignKey: "authorizedByUserId", as: "authorizedByUser" });
AppointmentModel.hasOne(AttendanceAuthorizationModel, { foreignKey: "appointmentId", as: "attendanceAuthorization" });
}

module.exports = setupSchedulingAssociations;

