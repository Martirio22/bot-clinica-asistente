const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class FinalizarMedicalAttention {
  constructor(attentionRepo) {
    this.attentionRepo = attentionRepo;
  }

  async ejecutar(id, clinicalData, userIdFromToken) {
    const attention = await this.attentionRepo.findById(id);
    if (!attention) throw new NotFoundError("Atención no encontrada");

    if (!attention.doctor || attention.doctor.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para finalizar esta atención");
    }

    if (!attention.isActive) {
      throw new ValidationError("Esta atención ya no está activa o ya fue finalizada");
    }

    const statusFinalizadoId = await this.attentionRepo.findStatusByCode('FINALIZADO');

    return await this.attentionRepo.update(id, {
      symptoms: clinicalData.symptoms,
      diagnosis: clinicalData.diagnosis,
      indications: clinicalData.indications,
      observations: clinicalData.observations,
      statusAttentionId: statusFinalizadoId,
      endDate: new Date()
    });
  }
}

module.exports = FinalizarMedicalAttention;