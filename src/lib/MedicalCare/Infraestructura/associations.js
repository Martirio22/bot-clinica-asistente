const PatientModel = require("../../Clinic/Patients/Infraestructura/PatientModel");
const DoctorModel = require("../../Clinic/Doctors/Infraestructura/DoctorModel");
const AppointmentModel = require("../../Scheduling/Appointments/Infraestructura/AppointmentModel");
const MedicalAttentionModel = require("../MedicalAttentions/Infraestructura/MedicalAttentionModel");
const AttentionStatusModel = require("../AttentionStatus/Infraestructura/AttentionStatusModel");
const MedicalPrescriptionModel = require("../MedicalPrescriptions/Infraestructura/MedicalPrescriptionModel");

function setupMedicalCareAssociations() {
  // MedicalAttention -> Cita
  MedicalAttentionModel.belongsTo(AppointmentModel, { foreignKey: "appointmentId", as: "appointment" });
  
  // MedicalAttention -> Paciente y Médico
  MedicalAttentionModel.belongsTo(PatientModel, { foreignKey: "patientId", as: "patient" });
  MedicalAttentionModel.belongsTo(DoctorModel, { foreignKey: "doctorId", as: "doctor" });
  
  // MedicalAttention -> Estado Propio
  MedicalAttentionModel.belongsTo(AttentionStatusModel, { foreignKey: "statusId", as: "status" });

  // Relaciones Inversas para consultas
  AppointmentModel.hasOne(MedicalAttentionModel, { foreignKey: "appointmentId", as: "medicalAttention" });

  MedicalAttentionModel.hasOne(MedicalPrescriptionModel, { foreignKey: "medicalAttentionId", as: "prescription" });
  MedicalPrescriptionModel.belongsTo(MedicalAttentionModel, { foreignKey: "medicalAttentionId", as: "medicalAttention" });
}

module.exports = setupMedicalCareAssociations;