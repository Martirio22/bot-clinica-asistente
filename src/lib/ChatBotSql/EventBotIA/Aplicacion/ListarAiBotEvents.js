class ListarAiBotEvents {
  constructor(aiBotEventRepository) {
    this.aiBotEventRepo = aiBotEventRepository;
  }

  async ejecutar(filters = {}) {
    return await this.aiBotEventRepo.findAll(filters);
  }
}

module.exports = ListarAiBotEvents;