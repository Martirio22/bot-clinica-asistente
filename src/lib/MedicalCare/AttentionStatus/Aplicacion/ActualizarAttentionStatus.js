const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarAttentionStatus {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar(id, data) {
    const ats = await this.asRepository.findById(id);
    if (!ats) throw new NotFoundError("Estado de atención no encontrado");

    return await this.asRepository.update(id, {
      code: data.code ?? ats.code,
      name: data.name ?? ats.name,
      description: data.description ?? ats.description,
      isActive: data.isActive ?? ats.isActive
    });
  }
}

module.exports = ActualizarAttentionStatus;