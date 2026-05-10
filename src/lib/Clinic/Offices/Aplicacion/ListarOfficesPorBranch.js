class ListarOfficesPorBranch {
  constructor(officeRepository) {
    this.officeRepository = officeRepository;
  }

  async ejecutar(branchId) {
    if (!branchId) throw new Error("El ID de la sucursal es obligatorio");
    return await this.officeRepository.findByBranch(branchId);
  }
}

module.exports = ListarOfficesPorBranch;