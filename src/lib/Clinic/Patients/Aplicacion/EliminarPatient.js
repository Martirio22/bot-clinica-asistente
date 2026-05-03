const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarPatient {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  async ejecutar(id) {
    const p = await this.patientRepository.findById(id);
    if (!p) throw new NotFoundError("Paciente no encontrado");

    await this.patientRepository.softDelete(id);
  }
}

module.exports = EliminarPatient;