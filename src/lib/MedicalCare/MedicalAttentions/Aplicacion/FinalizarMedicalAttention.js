class FinalizarMedicalAttention {
  constructor(attentionRepo) {
    this.attentionRepo = attentionRepo;
  }

  async ejecutar(id, clinicalData) {
    const attention = await this.attentionRepo.findById(id);
    if (!attention) throw new NotFoundError("Atención no encontrada");

    const statusFinalizadoId = await this.attentionRepo.findStatusByCode('FINALIZADO');

    return await this.attentionRepo.update(id, {
      ...clinicalData,
      statusAttentionId: statusFinalizadoId,
      endDate: new Date()
    });
  }
}
module.exports = FinalizarMedicalAttention;