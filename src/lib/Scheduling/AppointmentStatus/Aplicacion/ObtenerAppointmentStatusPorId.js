const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerAppointmentStatusPorId {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar(id) {
    const as = await this.asRepository.findById(id);
    if (!as) throw new NotFoundError("Estado de la cita no encontrada");
    return as;
  }
}

module.exports = ObtenerAppointmentStatusPorId;