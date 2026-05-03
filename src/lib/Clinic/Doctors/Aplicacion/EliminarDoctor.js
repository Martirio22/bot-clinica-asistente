const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarDoctor {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async ejecutar(id) {
    const d = await this.doctorRepository.findById(id);
    if (!d) throw new NotFoundError("Médico no encontrado");

    await this.doctorRepository.softDelete(id);
  }
}

module.exports = EliminarDoctor;