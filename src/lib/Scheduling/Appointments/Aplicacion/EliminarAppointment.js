const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarAppointment {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  async ejecutar(id) {
    const appointment = await this.appointmentRepo.findById(id);
    if (!appointment) throw new NotFoundError("Cita no encontrada");
    await this.appointmentRepo.softDelete(id);
  }
}

module.exports = EliminarAppointment;