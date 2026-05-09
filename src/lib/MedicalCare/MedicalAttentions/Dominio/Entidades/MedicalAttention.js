class MedicalAttention {
  constructor({
    id,
    appointmentId,
    patientId,
    doctorId,
    statusAttentionId,
    startDate = new Date(),
    endDate = null,
    reasonConsultation = null,
    symptoms = null,
    diagnosis = null,
    indications = null,
    observations = null,
    isActive = true,
    appointment = null,
    patient = null,
    doctor = null,
    status = null
  }) {
    if (!appointmentId) throw new Error("ID de cita requerido para la atención médica");
    if (!patientId) throw new Error("ID de paciente requerido");
    if (!doctorId) throw new Error("ID de médico requerido");
    if (!statusAttentionId) throw new Error("El estado de atención es obligatorio");

    this.id = id;
    this.appointmentId = appointmentId;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.statusAttentionId = statusAttentionId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.reasonConsultation = reasonConsultation;
    this.symptoms = symptoms;
    this.diagnosis = diagnosis;
    this.indications = indications;
    this.observations = observations;
    this.isActive = isActive;

    this.appointment = appointment;
    this.patient = patient;
    this.doctor = doctor;
    this.status = status;
  }
}

module.exports = MedicalAttention;