const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class ActualizarMedicalPrescription {
  constructor(prescriptionRepo) {
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(id, data, userIdFromToken) {
    const prescription = await this.prescriptionRepo.findById(id);
    if (!prescription) {
        throw new NotFoundError("Receta no encontrada");
    }
    if (prescription.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para modificar esta receta");
    }
    return await this.prescriptionRepo.update(id, {
      generalIndications: data.generalIndications ?? prescription.generalIndications
    });
  }
}

module.exports = ActualizarMedicalPrescription;