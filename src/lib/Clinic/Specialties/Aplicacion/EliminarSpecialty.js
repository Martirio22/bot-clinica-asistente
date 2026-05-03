const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarSpecialty {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id) {
    const s = await this.repository.findById(id);
    if (!s) throw new NotFoundError("Especialidad no encontrada");

    await this.repository.softDelete(id);
  }
}

module.exports = EliminarSpecialty;