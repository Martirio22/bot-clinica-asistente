const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerBotMenuPorId {
  constructor(botMenuRepository) {
    this.botMenuRepository = botMenuRepository;
  }

  async ejecutar(id) {
    const menu = await this.botMenuRepository.findById(id);
    if (!menu || !menu.isActive) throw new NotFoundError("Menú del bot no encontrado");
    return menu;
  }
}

module.exports = ObtenerBotMenuPorId;