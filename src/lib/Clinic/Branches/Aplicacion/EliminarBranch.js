const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarBranch {
    constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async ejecutar(id) {
    const b = await this.branchRepository.findById(id);
    if (!b) throw new NotFoundError("Sucursal no encontrada");

    await this.branchRepository.softDelete(id);
  }
}

module.exports = EliminarBranch;