const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarAppointmentStatus {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar(id, data) {
    const as = await this.asRepository.findById(id);
    if (!as) throw new NotFoundError("Estado de la cita no encontrado");

    return await this.asRepository.update(id, {
      code: data.code ?? as.code,
      name: data.name ?? as.name,
      description: data.description ?? as.description,
      isActive: data.isActive ?? as.isActive
    });
  }
}

module.exports = ActualizarAppointmentStatus;