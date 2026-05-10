const Appointment = require("../Dominio/Entidades/Appointment");
const ConflictError = require("../../../../shared/errors/ConflictError");
const ValidationError = require("../../../../shared/errors/ValidationError");
const NotFoundError = require("../../../../shared/errors/NotFoundError");

// CasosDeUso/Appointments/CrearAppointment.js
class CrearAppointment {
  constructor(repos) {
    this.repos = repos;
  }

  async ejecutar(data) {
    const [statusId, doctor] = await Promise.all([
      this.repos.appointment.findStatusByCode('RESERVADA'),
      this.repos.doctor.findById(data.doctorId)
    ]);

    if (!doctor || !doctor.isActive) throw new Error("Médico no disponible");
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate.getTime() + doctor.appointmentDurationMinutes * 60000);
    const horario = await this.repos.schedule.findSchedule(doctor.id, startDate.getDay(), data.startDate, endDate.toISOString());

    if (!horario) throw new Error("El médico no atiende en este horario");
    const nuevaCita = new Appointment({
      ...data,
      statusId,
      endDate: endDate.toISOString(),
      branchId: horario.branchId,
      officeId: horario.officeId,
      specialtyId: doctor.specialtyId
    });

    await this._validarDisponibilidad(nuevaCita);
    return await this.repos.appointment.create(nuevaCita);
  }
  async _validarDisponibilidad(cita) {
    const [bloqueo, solapada, duplicada] = await Promise.all([
      this.repos.blocking.findOverlap(cita.doctorId, cita.startDate, cita.endDate),
      this.repos.appointment.findOverlap(cita.doctorId, cita.startDate, cita.endDate),
      this.repos.appointment.findDuplicatePatientAppointment(cita.patientId, cita.specialtyId, cita.startDate)
    ]);
    if (bloqueo) throw new Error("El médico tiene un bloqueo (descanso/permiso)");
    if (solapada) throw new Error("El horario ya fue tomado por otro paciente");
    if (duplicada) throw new Error("El paciente ya tiene una cita para esta especialidad el mismo día");
  }
}

module.exports = CrearAppointment;