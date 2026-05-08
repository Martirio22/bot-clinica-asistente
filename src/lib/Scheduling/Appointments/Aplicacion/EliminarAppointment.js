const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarAppointment {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  async ejecutar(id) {
    const appointment = await this.appointmentRepo.findById(id);
    if (!appointment) {
      throw new NotFoundError("Cita no encontrada");
    }
    const canceladaStatusId = await this.appointmentRepo.findStatusByCode('CANCELADA');
    
    if (canceladaStatusId) {
      await this.appointmentRepo.softDeleteWithStatus(id, canceladaStatusId);
    } else {
      await this.appointmentRepo.softDelete(id);
    }
  }
}

module.exports = EliminarAppointment;