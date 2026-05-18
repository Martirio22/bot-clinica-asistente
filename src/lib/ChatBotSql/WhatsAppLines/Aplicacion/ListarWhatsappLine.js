class ListarWhatsappLine {
  constructor(whatsappLineRepository) {
    this.whatsappLineRepository = whatsappLineRepository;
  }

  async ejecutar() {
    return await this.whatsappLineRepository.findAll();
  }
}

module.exports = ListarWhatsappLine;