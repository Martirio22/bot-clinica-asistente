const MedicalAttention = require("../Dominio/Entidades/MedicalAttention");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class IniciarMedicalAttention {
  constructor(attentionRepo, appointmentRepo) {
    this.attentionRepo = attentionRepo;
    this.appointmentRepo = appointmentRepo;
  }

  async ejecutar(data, userIdFromToken) {
    const appointment = await this.appointmentRepo.findById(data.appointmentId);
    if (!appointment) throw new NotFoundError("Cita no encontrada");

    const doctor = appointment.doctor;
    
    if (!doctor || doctor.userId !== userIdFromToken) {
      throw new ValidationError("No puedes iniciar una atención de una cita que no te pertenece");
    }

    const ahora = new Date();
    const horaInicioCita = new Date(appointment.startDate);
    
    if (ahora < new Date(horaInicioCita.getTime() - 15 * 60000)) {
        throw new ValidationError(`Aún es temprano. La cita inicia a las ${appointment.startDate}`);
    }
    const existing = await this.attentionRepo.findByAppointmentId(data.appointmentId);
    if (existing) throw new ConflictError("Ya existe una atención iniciada para esta cita");
    const statusEnProcesoId = await this.attentionRepo.findStatusByCode('EN_PROCESO');
    const appointmentAtendidaId = await this.appointmentRepo.findStatusByCode('ATENDIDA');

    if (!statusEnProcesoId) throw new NotFoundError("Estado 'EN_PROCESO' no configurado");

    const nuevaAtencion = new MedicalAttention({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      statusAttentionId: statusEnProcesoId,
      reasonConsultation: appointment.reason || data.motivoConsulta,
      startDate: ahora
    });

    const atencionCreada = await this.attentionRepo.create(nuevaAtencion);
    await this.appointmentRepo.updateStatus(appointment.id, appointmentAtendidaId);

    return atencionCreada;
  }
}

module.exports = IniciarMedicalAttention;