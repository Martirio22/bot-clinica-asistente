class ListarMessageType {
  constructor(messageTypeRepository) {
    this.messageTypeRepository = messageTypeRepository;
  }

  async ejecutar() {
    return await this.messageTypeRepository.findAll();
  }
}

module.exports = ListarMessageType;