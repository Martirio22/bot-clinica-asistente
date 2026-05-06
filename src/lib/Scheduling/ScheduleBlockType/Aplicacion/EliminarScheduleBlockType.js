const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarScheduleBlockType {
  constructor(sbtRepository) {
    this.sbtRepository = sbtRepository;
  }

  async ejecutar(id) {
    const sbt = await this.sbtRepository.findById(id);
    if (!sbt) throw new NotFoundError("Tipo de bloqueo no encontrado");

    await this.sbtRepository.softDelete(id);
  }
}

module.exports = EliminarScheduleBlockType;