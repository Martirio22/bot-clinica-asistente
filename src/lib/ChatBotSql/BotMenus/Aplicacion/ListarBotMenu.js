class ListarBotMenu {
  constructor(botMenuRepository) {
    this.botMenuRepository = botMenuRepository;
  }

  async ejecutar() {
    return await this.botMenuRepository.findAll();
  }
}

module.exports = ListarBotMenu;