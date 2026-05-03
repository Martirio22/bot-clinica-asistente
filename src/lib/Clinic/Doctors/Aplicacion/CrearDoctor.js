const Doctor = require("../Dominio/Entidades/Doctor");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearDoctor {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async ejecutar(data) {
    return await this.doctorRepository.create(
      new Doctor({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearDoctor;