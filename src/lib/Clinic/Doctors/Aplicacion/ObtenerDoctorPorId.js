const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerDoctorPorId {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async ejecutar(id) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new NotFoundError("Médico no encontrado");
    return doctor;
  }
}

module.exports = ObtenerDoctorPorId;