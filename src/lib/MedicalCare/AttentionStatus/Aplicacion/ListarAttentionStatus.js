class ListarAttentionStatus {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar() {
    return await this.asRepository.findAll();
  }
}

module.exports = ListarAttentionStatus;