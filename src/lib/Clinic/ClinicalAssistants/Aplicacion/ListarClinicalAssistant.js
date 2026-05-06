class ListarClinicalAssistant {
  constructor(caRepository) {
    this.caRepository = caRepository;
  }

  async ejecutar() {
    return await this.caRepository.findAll();
  }
}

module.exports = ListarClinicalAssistant;