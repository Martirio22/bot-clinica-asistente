const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarOffice {
  constructor(officeRepository) {
    this.officeRepository = officeRepository;
  }

  async ejecutar(id) {
    const o = await this.officeRepository.findById(id);
    if (!o) throw new NotFoundError("Consultorio no encontrado");

    await this.officeRepository.softDelete(id);
  }
}

module.exports = EliminarOffice;