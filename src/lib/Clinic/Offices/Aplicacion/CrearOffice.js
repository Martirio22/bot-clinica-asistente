const Office = require("../Dominio/Entidades/Office");
const ConflictError = require("../../../../shared/errors/ConflictError");
const NotFoundError = require("../../../../shared/errors/NotFoundError");

class CrearOffice {
  constructor(officeRepository, branchRepository) {
    this.officeRepository = officeRepository;
    this.branchRepository = branchRepository;
  }

  async ejecutar(data) {
  const nuevaOffice = new Office({ ...data, isActive: true });

  const branch = await this.branchRepository.findById(nuevaOffice.branchId);
  if (!branch) throw new NotFoundError("La sucursal no existe");
  if (!branch.isActive) throw new ConflictError("La sucursal seleccionada está inactiva");

  if (await this.officeRepository.findByCodeAndBranch(nuevaOffice.code, nuevaOffice.branchId)) {
    throw new ConflictError("Ya existe un consultorio con ese código en la sucursal");
  }

  return await this.officeRepository.create(nuevaOffice);
}
}

module.exports = CrearOffice;