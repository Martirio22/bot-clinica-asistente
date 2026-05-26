const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class ActualizarMedicalPrescriptionDetail {
  constructor(detailRepo, prescriptionRepo) {
    this.detailRepo = detailRepo;
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(id, data, userIdFromToken) {
    const detail = await this.detailRepo.findById(id);
    if (!detail) throw new NotFoundError("Detalle no encontrado");
    const prescription = await this.prescriptionRepo.findById(detail.medicalPrescriptionId);
    if (prescription.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para modificar este detalle");
    }
    return await this.detailRepo.update(id, {
      medicine: data.medicine ?? detail.medicine,
      dose: data.dose ?? detail.dose,
      frequency: data.frequency ?? detail.frequency,
      duration: data.duration ?? detail.duration,
      indications: data.indications ?? detail.indications,
      order: data.order ?? detail.order
    });
  }
}

module.exports = ActualizarMedicalPrescriptionDetail;