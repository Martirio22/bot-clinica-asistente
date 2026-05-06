const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarClinicalAssistant {
  constructor(caRepository) {
    this.caRepository = caRepository;
  }

  async ejecutar(id) {
    const ca = await this.caRepository.findById(id);
    if (!ca) throw new NotFoundError("Asistente clínico no encontrado");

    await this.caRepository.softDelete(id);
  }
}

module.exports = EliminarClinicalAssistant;