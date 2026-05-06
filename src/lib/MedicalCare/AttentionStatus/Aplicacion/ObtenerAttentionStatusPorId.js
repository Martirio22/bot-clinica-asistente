const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerAttentionStatusPorId {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar(id) {
    const ats = await this.asRepository.findById(id);
    if (!ats) throw new NotFoundError("Estado de atención no encontrado");
    return ats;
  }
}

module.exports = ObtenerAttentionStatusPorId;