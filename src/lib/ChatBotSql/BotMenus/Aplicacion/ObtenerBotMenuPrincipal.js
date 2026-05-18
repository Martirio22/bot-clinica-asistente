const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerBotMenuPrincipal {
  constructor(botMenuRepository) {
    this.botMenuRepository = botMenuRepository;
  }

  async ejecutar() {
    const menu = await this.botMenuRepository.findMainMenu();
    if (!menu) throw new NotFoundError("Menú principal del sistema no configurado");
    return menu;
  }
}

module.exports = ObtenerBotMenuPrincipal;