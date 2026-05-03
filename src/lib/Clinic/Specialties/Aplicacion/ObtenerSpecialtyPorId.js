const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerSpecialtyPorId {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id) {
    const data = await this.repository.findById(id);
    if (!data) throw new NotFoundError("Especialidad no encontrada");
    return data;
  }
}

module.exports = ObtenerSpecialtyPorId;