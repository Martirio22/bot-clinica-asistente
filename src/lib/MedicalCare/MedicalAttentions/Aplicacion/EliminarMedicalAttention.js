const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class EliminarMedicalAttention {
  constructor(attentionRepo) {
    this.attentionRepo = attentionRepo;
  }

  async ejecutar(id, userIdFromToken) {
    const attention = await this.attentionRepo.findById(id);
    if (!attention) throw new NotFoundError("Atención no encontrada");

    if (!attention.doctor || attention.doctor.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para eliminar esta atención");
    }

    const statusCanceladoId = await this.attentionRepo.findStatusByCode('CANCELADO');

    await this.attentionRepo.update(id, { 
      statusAttentionId: statusCanceladoId,
      isActive: false 
    });
  }
}

module.exports = EliminarMedicalAttention;