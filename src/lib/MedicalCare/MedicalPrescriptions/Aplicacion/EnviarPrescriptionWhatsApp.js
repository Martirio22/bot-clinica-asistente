const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class EnviarPrescriptionWhatsapp {
  // Quitamos detailRepo porque prescriptionRepo ya trae los items incluidos
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

    // 💡 SOLUCIÓN: Usamos los items mapeados por el toDomain del repositorio
    const detalles = prescription.items || [];    
    if (detalles.length === 0) {
      throw new ValidationError("No puedes enviar una receta sin medicamentos registrados");
    }

    // TODO: Aquí deberías invocar a tu ExternalWhatsappService para enviar el texto real 
    // antes de marcarla como enviada, similar a como lo haces en el bot.

    return await this.prescriptionRepo.update(id, {
      isSentWhatsapp: true,
      whatsappSentDate: new Date()
    });
  }
}

module.exports = EnviarPrescriptionWhatsapp;