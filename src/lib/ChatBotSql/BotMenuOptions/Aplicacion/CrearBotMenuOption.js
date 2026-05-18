const BotMenuOption = require("../Dominio/Entidades/BotMenuOption");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearBotMenuOption {
  constructor(optionRepo) {
    this.optionRepo = optionRepo;
  }

  async ejecutar(data) {
    const nuevaOpcion = new BotMenuOption({ ...data, isActive: true });
    const opcionDuplicada = await this.optionRepo.findByMenuAndCode(nuevaOpcion.menuBotId, nuevaOpcion.code);
    if (opcionDuplicada) {
      throw new ConflictError(`La opción '${nuevaOpcion.code}' ya existe configurada para este menú.`);
    }

    return await this.optionRepo.create(nuevaOpcion);
  }
}

module.exports = CrearBotMenuOption;