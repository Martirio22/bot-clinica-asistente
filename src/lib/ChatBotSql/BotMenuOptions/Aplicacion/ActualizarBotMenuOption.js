const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarBotMenuOption {
  constructor(optionRepo) {
    this.optionRepo = optionRepo;
  }

  async ejecutar(id, data) {
    const option = await this.optionRepo.findById(id);
    if (!option || !option.isActive) throw new NotFoundError("Opción de menú no encontrada");

    return await this.optionRepo.update(id, {
      code: data.code ?? option.code,
      optionText: data.optionText ?? option.optionText,
      action: data.action ? data.action.toUpperCase() : option.action,
      targetMenuId: data.targetMenuId !== undefined ? data.targetMenuId : option.targetMenuId,
      order: data.order ?? option.order,
      isActive: data.isActive ?? option.isActive
    });
  }
}

module.exports = ActualizarBotMenuOption;