const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class ActualizarAppointment {
  constructor(repos) {
    this.repos = repos;
  }

  async ejecutar(id, data) {
    const appointment = await this.repos.appointment.findById(id);
    if (!appointment) throw new NotFoundError("Cita no encontrada");

    const doctor = await this.repos.doctor.findById(appointment.doctorId);
    const startDate = new Date(data.startDate || appointment.startDate);
    const endDate = new Date(startDate.getTime() + doctor.appointmentDurationMinutes * 60000);

    const updateData = {
      ...data,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      branchId: appointment.branchId,
      officeId: appointment.officeId
    };

    if (data.startDate && data.startDate !== appointment.startDate) {
      const horario = await this.repos.schedule.findSchedule(
        doctor.id, startDate.getDay(), updateData.startDate, updateData.endDate
      );
      if (!horario) throw new ConflictError("El médico no atiende en este nuevo horario seleccionado");
      updateData.branchId = horario.branchId;
      updateData.officeId = horario.officeId;
    }

    await this._validarConflictos(id, appointment.doctorId, updateData);
    return await this.repos.appointment.update(id, updateData);
  }

  async _validarConflictos(id, doctorId, data) {
    const [bloqueo, solapada] = await Promise.all([
      this.repos.blocking.findOverlap(doctorId, data.startDate, data.endDate),
      this.repos.appointment.findOverlap(doctorId, data.startDate, data.endDate, id)
    ]);
    if (bloqueo) throw new ConflictError("El médico tiene un bloqueo en esa fecha");
    if (solapada) throw new ConflictError("El nuevo horario ya está ocupado por otra cita");
  }
}

module.exports = ActualizarAppointment;