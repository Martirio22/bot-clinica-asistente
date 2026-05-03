const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarSpecialty {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id, data) {
    const s = await this.repository.findById(id);
    if (!s) throw new NotFoundError("Especialidad no encontrada");

    return await this.repository.update(id, {
      code: data.code ?? s.code,
      name: data.name ?? s.name,
      description: data.description ?? s.description,
      isActive: data.isActive ?? s.isActive
    });
  }
}

module.exports = ActualizarSpecialty;