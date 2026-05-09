const MedicalPrescription = require("../Dominio/Entidades/MedicalPrescription");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearMedicalPrescription {
  constructor(prescriptionRepo, attentionRepo) {
    this.prescriptionRepo = prescriptionRepo;
    this.attentionRepo = attentionRepo;
  }

  async ejecutar(data, userIdFromToken) {
    const code = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nuevaPrescription = new MedicalPrescription({
      ...data,
      prescriptionCode: code,
      issueDate: new Date()
    });
    const attention = await this.attentionRepo.findById(nuevaPrescription.medicalAttentionId);
    if (!attention) {
        throw new NotFoundError("Atención médica no encontrada");
    }
    if (!attention.isActive) {
        throw new ValidationError("No se puede generar una receta para una atención médica inactiva");
    }
    if (attention.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para generar una receta en esta atención");
    }
    const recetaExistente = await this.prescriptionRepo.findByAttentionId(nuevaPrescription.medicalAttentionId);
    if (recetaExistente) {
      throw new ConflictError("Ya existe una receta médica registrada para esta atención");
    }

    return await this.prescriptionRepo.create(nuevaPrescription);
  }
}

module.exports = CrearMedicalPrescription;