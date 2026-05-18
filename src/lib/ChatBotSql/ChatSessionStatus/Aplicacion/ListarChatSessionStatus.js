class ListarChatSessionStatuses {
  constructor(statusRepository) {
    this.statusRepository = statusRepository;
  }

  async ejecutar() {
    return await this.statusRepository.findAll();
  }
}

module.exports = ListarChatSessionStatuses;