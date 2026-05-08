const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerScheduleBlockPorId {
  constructor(blockingRepo) {
    this.blockingRepo = blockingRepo;
  }

  async ejecutar(id) {
    const block = await this.blockingRepo.findById(id);
    if (!block) throw new NotFoundError("Bloqueo de agenda no encontrado");
    return block;
  }
}

module.exports = ObtenerScheduleBlockPorId;