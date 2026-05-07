const Specialty = require("../Dominio/Entidades/Specialty");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearSpecialty {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(data) {
  const nuevaSpecialty = new Specialty({ ...data, isActive: true });

  if (await this.repository.findByCode(nuevaSpecialty.code)) {
    throw new ConflictError("Ya existe una especialidad con ese codigo");
  }

  return await this.repository.create(nuevaSpecialty);
}
}

module.exports = CrearSpecialty;