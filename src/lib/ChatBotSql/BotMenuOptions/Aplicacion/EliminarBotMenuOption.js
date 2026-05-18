const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarBotMenuOption {
  constructor(optionRepo) {
    this.optionRepo = optionRepo;
  }

  async ejecutar(id) {
    const option = await this.optionRepo.findById(id);
    if (!option) throw new NotFoundError("Opción de menú no encontrada");

    await this.optionRepo.softDelete(id);
  }
}

module.exports = EliminarBotMenuOption;