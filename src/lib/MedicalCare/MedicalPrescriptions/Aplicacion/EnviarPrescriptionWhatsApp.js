const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class EnviarPrescriptionWhatsapp {
  constructor(prescriptionRepo) {
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(id, userIdFromToken) {
    const prescription = await this.prescriptionRepo.findById(id);
    if (!prescription) throw new NotFoundError("Receta no encontrada");
    if (prescription.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para enviar esta receta");
    }
    const whatsappNumber = prescription.medicalAttention?.patient?.whatsappPhone;
    if (!whatsappNumber) {
      throw new ValidationError("El paciente no tiene un número de WhatsApp registrado");
    }
    return await this.prescriptionRepo.update(id, {
      isSentWhatsapp: true,
      whatsappSentDate: new Date()
    });
  }
}

module.exports = EnviarPrescriptionWhatsapp;