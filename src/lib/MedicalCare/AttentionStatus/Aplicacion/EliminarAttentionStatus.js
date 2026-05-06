const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarAttentionStatus {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar(id) {
    const ats = await this.asRepository.findById(id);
    if (!ats) throw new NotFoundError("Estado de atención no encontrado");

    await this.asRepository.softDelete(id);
  }
}

module.exports = EliminarAttentionStatus;