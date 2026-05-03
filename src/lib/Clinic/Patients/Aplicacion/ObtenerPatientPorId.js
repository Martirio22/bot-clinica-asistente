const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerPatientPorId {

    constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

   async ejecutar(id) {
    const patient = await this.patientRepository.findById(id);
    if (!patient) throw new NotFoundError("Paciente no encontrado");
    return patient;
  }
}

module.exports = ObtenerPatientPorId;