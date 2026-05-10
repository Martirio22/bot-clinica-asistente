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

    const updatedData = {
      doctorId: block.doctorId,
      blockingTypeId: data.blockingTypeId ?? block.blockingTypeId,
      startDate: data.startDate ?? block.startDate,
      endDate: data.endDate ?? block.endDate,
      reason: data.reason ?? block.reason,
      isActive: data.isActive ?? block.isActive
    };

    if (data.blockingTypeId && data.blockingTypeId !== block.blockingTypeId) {
      const type = await this.blockTypeRepo.findById(data.blockingTypeId);
      if (!type || !type.isActive) throw new NotFoundError("El tipo de bloqueo seleccionado es inválido o está inactivo");
    }
    const overlap = await this.blockingRepo.findOverlap(
      updatedData.doctorId,
      updatedData.startDate,
      updatedData.endDate,
      id
    );
    if (overlap) {throw new ConflictError("El nuevo rango de fechas choca con otro bloqueo existente para este médico");}
    return await this.blockingRepo.update(id, updatedData);
  }
}

module.exports = ActualizarScheduleBlock;