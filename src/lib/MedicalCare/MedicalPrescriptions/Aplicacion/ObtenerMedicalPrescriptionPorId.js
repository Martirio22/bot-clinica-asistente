const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class ObtenerMedicalPrescriptionPorId {
  constructor(prescriptionRepo) {
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(id, userIdFromToken) {
    const prescription = await this.prescriptionRepo.findById(id);
    if (!prescription) throw new NotFoundError("Receta médica no encontrada");
    if (prescription.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para ver esta receta");
    }

    return prescription;
  }
}

module.exports = ObtenerMedicalPrescriptionPorId;