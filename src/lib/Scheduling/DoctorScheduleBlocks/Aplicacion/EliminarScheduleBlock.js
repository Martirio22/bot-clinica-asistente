const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarScheduleBlock {
  constructor(blockingRepo) {
    this.blockingRepo = blockingRepo;
  }

  async ejecutar(id) {
    const block = await this.blockingRepo.findById(id);
    if (!block) throw new NotFoundError("Bloqueo no encontrado");
    await this.blockingRepo.softDelete(id);
  }
}

module.exports = EliminarScheduleBlock;