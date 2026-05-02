const Office = require("../Dominio/Entidades/Office");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearOffice {
    constructor(officeRepository) {
    this.officeRepository = officeRepository;
  }

  async ejecutar(data) {
    if (await this.officeRepository.findByCodeAndBranch(data.code, data.branchId)) {
     throw new ConflictError("Ya existe un consultorio con ese código en la sucursal");
    }

    return await this.officeRepository.create(
      new Office({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearOffice;