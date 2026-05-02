const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerBranchPorId {

    constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

   async ejecutar(id) {
    const branch = await this.branchRepository.findById(id);
    if (!branch) throw new NotFoundError("Sucursal no encontrada");
    return branch;
  }
}

module.exports = ObtenerBranchPorId;