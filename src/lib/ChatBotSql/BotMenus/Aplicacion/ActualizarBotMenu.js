const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarBotMenu {
  constructor(botMenuRepository) {
    this.botMenuRepository = botMenuRepository;
  }

  async ejecutar(id, data) {
    const menu = await this.botMenuRepository.findById(id);
    if (!menu) throw new NotFoundError("Menú del bot no encontrado");

    return await this.botMenuRepository.update(id, {
      code: data.code ? data.code.trim().toUpperCase() : menu.code,
      name: data.name ?? menu.name,
      message: data.message ?? menu.message,
      isMainMenu: data.isMainMenu ?? menu.isMainMenu,
      isActive: data.isActive ?? menu.isActive
    });
  }
}

module.exports = ActualizarBotMenu;