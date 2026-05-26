const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class EliminarMedicalPrescriptionDetail {
  constructor(detailRepo, prescriptionRepo) {
    this.detailRepo = detailRepo;
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(id, userIdFromToken) {
    const detail = await this.detailRepo.findById(id);
    if (!detail) throw new NotFoundError("Detalle no encontrado");

    const prescription = await this.prescriptionRepo.findById(detail.medicalPrescriptionId);

    if (prescription.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para eliminar este detalle");
    }

    await this.detailRepo.softDelete(id);
  }
}

module.exports = EliminarMedicalPrescriptionDetail;