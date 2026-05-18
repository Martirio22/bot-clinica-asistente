class ListarBotIntent {
  constructor(botIntentRepository) {
    this.botIntentRepository = botIntentRepository;
  }

  async ejecutar() {
    return await this.botIntentRepository.findAll();
  }
}

module.exports = ListarBotIntent;