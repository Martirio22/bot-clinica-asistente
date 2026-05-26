const PatientModel = require("../../Clinic/Patients/Infraestructura/PatientModel");
const DoctorModel = require("../../Clinic/Doctors/Infraestructura/DoctorModel");
const AppointmentModel = require("../../Scheduling/Appointments/Infraestructura/AppointmentModel");
const MedicalAttentionModel = require("../MedicalAttentions/Infraestructura/MedicalAttentionModel");
const AttentionStatusModel = require("../AttentionStatus/Infraestructura/AttentionStatusModel");
const MedicalPrescriptionModel = require("../MedicalPrescriptions/Infraestructura/MedicalPrescriptionModel");
const MedicalPrescriptionDetailModel = require("../MedicalPrescriptionDetails/Infraestructura/MedicalPrescriptionDetailModel");

function setupMedicalCareAssociations() {
  // MedicalAttention -> Cita
  MedicalAttentionModel.belongsTo(AppointmentModel, { foreignKey: "appointmentId", as: "appointment" });
  
  // MedicalAttention -> Paciente y Médico
  MedicalAttentionModel.belongsTo(PatientModel, { foreignKey: "patientId", as: "patient" });
  MedicalAttentionModel.belongsTo(DoctorModel, { foreignKey: "doctorId", as: "doctor" });
  
  // MedicalAttention -> Estado Propio
  MedicalAttentionModel.belongsTo(AttentionStatusModel, { foreignKey: "statusAttentionId", as: "status" });

  // Relaciones Inversas para consultas
  AppointmentModel.hasOne(MedicalAttentionModel, { foreignKey: "appointmentId", as: "medicalAttention" });

  //Recetas Medicas
  MedicalAttentionModel.hasOne(MedicalPrescriptionModel, { foreignKey: "medicalAttentionId", as: "prescription" });
  MedicalPrescriptionModel.belongsTo(MedicalAttentionModel, { foreignKey: "medicalAttentionId", as: "medicalAttention" });

  //Detalle de la Receta
  MedicalPrescriptionModel.hasMany(MedicalPrescriptionDetailModel, { foreignKey: "medicalPrescriptionId", as: "items" });
  MedicalPrescriptionDetailModel.belongsTo(MedicalPrescriptionModel, { foreignKey: "medicalPrescriptionId", as: "prescription" });
}

module.exports = setupMedicalCareAssociations;