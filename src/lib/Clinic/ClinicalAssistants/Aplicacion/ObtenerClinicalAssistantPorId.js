const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerClinicalAssistantPorId {
  constructor(caRepository) {
    this.caRepository = caRepository;
  }

  async ejecutar(id) {
    const assistant = await this.caRepository.findById(id);
    if (!assistant) throw new NotFoundError("Asistente clínico no encontrado");
    return assistant;
  }
}

module.exports = ObtenerClinicalAssistantPorId;