class EliminarMedicalAttention {
  constructor(attentionRepo) {
    this.attentionRepo = attentionRepo;
  }

  async ejecutar(id) {
    const attention = await this.attentionRepo.findById(id);
    if (!attention) throw new NotFoundError("Atención no encontrada");

    const statusCanceladoId = await this.attentionRepo.findStatusByCode('CANCELADO');

    await this.attentionRepo.update(id, { 
      statusAttentionId: statusCanceladoId,
      isActive: false 
    });
  }
}
module.exports = EliminarMedicalAttention;