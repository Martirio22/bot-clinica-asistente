const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerAppointmentPorId {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  async ejecutar(id) {
    const appointment = await this.appointmentRepo.findById(id);
    if (!appointment) throw new NotFoundError("Cita no encontrada");
    return appointment;
  }
}

module.exports = ObtenerAppointmentPorId;