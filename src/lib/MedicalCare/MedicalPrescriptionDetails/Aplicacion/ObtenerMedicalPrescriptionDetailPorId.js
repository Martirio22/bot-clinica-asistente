const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class ObtenerMedicalPrescriptionDetailPorId {
  constructor(detailRepo) {
    this.detailRepo = detailRepo;
  }

  async ejecutar(id, userIdFromToken) {
    const detail = await this.detailRepo.findById(id);
    if (!detail || !detail.isActive) {throw new NotFoundError("Detalle de receta no encontrado");}
    if (detail.medicalAttention?.doctor?.userId !== userIdFromToken) {
      throw new ValidationError("No tienes permiso para ver esta receta");
    }
    return detail;
  }
}

module.exports = ObtenerMedicalPrescriptionDetailPorId;