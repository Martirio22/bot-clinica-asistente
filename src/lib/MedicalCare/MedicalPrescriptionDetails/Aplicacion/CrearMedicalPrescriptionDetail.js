const MedicalPrescriptionDetail = require("../Dominio/Entidades/MedicalPrescriptionDetail");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class CrearMedicalPrescriptionDetail {
  constructor(detailRepo, prescriptionRepo) {
    this.detailRepo = detailRepo;
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(data, userIdFromToken) {
    const nuevoDetalle = new MedicalPrescriptionDetail(data);
    
    const prescription = await this.prescriptionRepo.findById(data.medicalPrescriptionId);
    if (!prescription) throw new NotFoundError("Receta médica no encontrada");
    if (!prescription.isActive) {
        throw new ValidationError("No se puede agregar detalles a una receta médica inactiva");
    }
    if (prescription.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para agregar detalles a esta receta");
    }

    return await this.detailRepo.create(nuevoDetalle);
  }
}

module.exports = CrearMedicalPrescriptionDetail;