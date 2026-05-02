class ListarBranch {
    constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async ejecutar() {
    return await this.branchRepository.findAll();
  }
}

module.exports = ListarBranch;