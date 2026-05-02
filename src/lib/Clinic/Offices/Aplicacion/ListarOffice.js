class ListarOffice {
    constructor(officeRepository) {
    this.officeRepository = officeRepository;
  }

  async ejecutar() {
    return await this.officeRepository.findAll();
  }
}

module.exports = ListarOffice;