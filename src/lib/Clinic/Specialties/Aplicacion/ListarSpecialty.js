class ListarSpecialty {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar() {
    return await this.repository.findAll();
  }
}

module.exports = ListarSpecialty;