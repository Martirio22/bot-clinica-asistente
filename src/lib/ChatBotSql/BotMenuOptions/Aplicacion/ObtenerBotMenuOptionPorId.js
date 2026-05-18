const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerBotMenuOptionPorId {
  constructor(optionRepo) {
    this.optionRepo = optionRepo;
  }

  async ejecutar(id) {
    const option = await this.optionRepo.findById(id);
    if (!option || !option.isActive) throw new NotFoundError("Opción de menú no encontrada");
    return option;
  }
}

module.exports = ObtenerBotMenuOptionPorId;