const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarScheduleBlockType {
  constructor(sbtRepository) {
    this.sbtRepository = sbtRepository;
  }

  async ejecutar(id, data) {
    const sbt = await this.sbtRepository.findById(id);
    if (!sbt) throw new NotFoundError("Tipo de bloqueo no encontrado");

    return await this.sbtRepository.update(id, {
      code: data.code ?? sbt.code,
      name: data.name ?? sbt.name,
      description: data.description ?? sbt.description,
      isActive: data.isActive ?? sbt.isActive
    });
  }
}

module.exports = ActualizarScheduleBlockType;