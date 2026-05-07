const ScheduleBlockType = require("../Dominio/Entidades/ScheduleBlockType");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearScheduleBlockType {
  constructor(repository) {
    this.repository = repository;
  }

async ejecutar(data) {
    const nuevoTipoBloqueo = new ScheduleBlockType({
      ...data,
      isActive: true
    });

    if (await this.repository.findByCode(nuevoTipoBloqueo.code)) {
      throw new ConflictError("El código de tipo de bloqueo ya existe");
    }

    return await this.repository.create(nuevoTipoBloqueo);
  }
}

module.exports = CrearScheduleBlockType;