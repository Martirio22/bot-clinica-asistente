const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class ActualizarScheduleBlock {
  constructor(blockingRepo, blockTypeRepo) {
    this.blockingRepo = blockingRepo;
    this.blockTypeRepo = blockTypeRepo;
  }

  async ejecutar(id, data) {
    const block = await this.blockingRepo.findById(id);
    if (!block) throw new NotFoundError("Bloqueo no encontrado");

    if (data.blockingTypeId && String(data.blockingTypeId) !== String(block.blockingTypeId)) {
      const type = await this.blockTypeRepo.findById(data.blockingTypeId);
      if (!type || !type.isActive) throw new ConflictError("Tipo de bloqueo inválido");
    }

    const start = data.startDate || block.startDate;
    const end = data.endDate || block.endDate;

    if (start !== block.startDate || end !== block.endDate) {
      const overlap = await this.blockingRepo.findOverlap(block.doctorId, start, end);
      if (overlap && overlap.id !== id) {
        throw new ConflictError("El nuevo rango de fechas choca con otro bloqueo existente");
      }
    }

    return await this.blockingRepo.update(id, {
        doctorId: data.doctorId ?? block.doctorId,
        blockingTypeId: data.blockingTypeId ?? block.blockingTypeId,
        startDate: data.startDate ?? block.startDate,
        endDate: data.endDate ?? block.endDate,
        reason: data.reason ?? block.reason,
        registerByUserId: data.registerByUserId ?? block.registerByUserId,
        isActive: data.isActive ?? block.isActive
    });
  }
}

module.exports = ActualizarScheduleBlock;