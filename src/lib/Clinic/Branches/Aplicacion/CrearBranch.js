const Branch = require("../Dominio/Entidades/Branch");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearBranch {
    constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async ejecutar(data) {
    return await this.branchRepository.create(
      new Branch({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearBranch;