const BotMenu = require("../Dominio/Entidades/BotMenu");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearBotMenu {
  constructor(botMenuRepository) {
    this.botMenuRepository = botMenuRepository;
  }

  async ejecutar(data) {
    const menu = new BotMenu({ ...data, isActive: true });
    const menuExistente = await this.botMenuRepository.findByCode(menu.code);
    if (menuExistente) {throw new ConflictError(`El código de menú '${menu.code}' ya existe.`);}
    return await this.botMenuRepository.create(menu);
  }
}

module.exports = CrearBotMenu;