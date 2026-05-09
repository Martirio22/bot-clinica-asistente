const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class ObtenerMedicalAttentionPorId {
  constructor(attentionRepo) {
    this.attentionRepo = attentionRepo;
  }

  async ejecutar(id, userIdFromToken) {
    const attention = await this.attentionRepo.findById(id);

    if (!attention) {
      throw new NotFoundError("La atención médica no existe");
    }

    if (!attention.doctor || attention.doctor.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para ver esta atención");
    }

    return attention;
  }
}

module.exports = ObtenerMedicalAttentionPorId;