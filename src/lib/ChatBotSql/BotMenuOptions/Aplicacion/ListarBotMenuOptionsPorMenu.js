class ListarBotMenuOptionsPorMenu {
  constructor(optionRepo) {
    this.optionRepo = optionRepo;
  }

  async ejecutar(menuBotId) {
    return await this.optionRepo.findAllByMenu(menuBotId);
  }
}

module.exports = ListarBotMenuOptionsPorMenu;