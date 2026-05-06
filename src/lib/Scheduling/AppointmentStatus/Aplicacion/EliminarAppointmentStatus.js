const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarAppointmentStatus {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar(id) {
    const as = await this.asRepository.findById(id);
    if (!as) throw new NotFoundError("Estado de la cita no encontrado");

    await this.asRepository.softDelete(id);
  }
}

module.exports = EliminarAppointmentStatus;