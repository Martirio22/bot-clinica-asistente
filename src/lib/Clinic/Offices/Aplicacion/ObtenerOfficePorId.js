const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerOfficePorId {
  constructor(officeRepository) {
    this.officeRepository = officeRepository;
  }

  async ejecutar(id) {
    const office = await this.officeRepository.findById(id);
    if (!office) throw new NotFoundError("Consultorio no encontrado");
    return office;
  }
}

module.exports = ObtenerOfficePorId;