const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class EliminarMedicalPrescription {
  constructor(prescriptionRepo) {
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(id, userIdFromToken) {
    const prescription = await this.prescriptionRepo.findById(id);
    if (!prescription) throw new NotFoundError("Receta no encontrada");

    if (prescription.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para eliminar esta receta");
    }

    await this.prescriptionRepo.softDelete(id);
  }
}

module.exports = EliminarMedicalPrescription;