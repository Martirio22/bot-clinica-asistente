const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarBotMenu {
  constructor(botMenuRepository) {
    this.botMenuRepository = botMenuRepository;
  }

  async ejecutar(id) {
    const menu = await this.botMenuRepository.findById(id);
    if (!menu) throw new NotFoundError("Menú del bot no encontrado");

    await this.botMenuRepository.softDelete(id);
  }
}

module.exports = EliminarBotMenu;