const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class EnviarPrescriptionWhatsapp {
  constructor(prescriptionRepo, detailRepo) {
    this.prescriptionRepo = prescriptionRepo;
    this.detailRepo = detailRepo;
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
    const detalles = await this.detailRepo.findByPrescriptionId(id);    
    if (detalles.length === 0) {
      throw new ValidationError("No puedes enviar una receta sin medicamentos registrados");
    }
    return await this.prescriptionRepo.update(id, {
      isSentWhatsapp: true,
      whatsappSentDate: new Date()
    });
  }
}

module.exports = EnviarPrescriptionWhatsapp;