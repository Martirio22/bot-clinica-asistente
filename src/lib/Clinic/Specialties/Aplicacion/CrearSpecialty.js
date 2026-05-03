const Specialty = require("../Dominio/Entidades/Specialty");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearSpecialty {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(data) {
    if (await this.repository.findByCode(data.code)) throw new ConflictError("Ya existe una especialidad con ese codigo");
    if (await this.repository.findByName(data.name)) throw new ConflictError("Ya existe una especialidad");
    return await this.repository.create(
      new Specialty({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearSpecialty;