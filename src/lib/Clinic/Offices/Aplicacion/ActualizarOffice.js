const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarOffice {
  constructor(officeRepository) {
    this.officeRepository = officeRepository;
  }

  async ejecutar(id, data) {
    const o = await this.officeRepository.findById(id);
    if (!o) throw new NotFoundError("Consultorio no encontrado");

    return await this.officeRepository.update(id, {
      branchId: data.branchId ?? o.branchId,
      code: data.code ?? o.code,
      name: data.name ?? o.name,
      floor: data.floor ?? o.floor,
      isActive: data.isActive ?? o.isActive
    });
  }
}

module.exports = ActualizarOffice;