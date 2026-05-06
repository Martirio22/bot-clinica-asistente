const ScheduleBlockType = require("../Dominio/Entidades/ScheduleBlockType");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearScheduleBlockType {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(data) {
    if (await this.repository.findByCode(data.code)) {
      throw new ConflictError("El código de tipo de bloqueo ya existe");
    }

    return await this.repository.create(
      new ScheduleBlockType({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearScheduleBlockType;