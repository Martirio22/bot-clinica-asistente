const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarBotIntent {
  constructor(botIntentRepository) {
    this.botIntentRepository = botIntentRepository;
  }

  async ejecutar(id, data) {
    const intent = await this.botIntentRepository.findById(id);
    if (!intent || !intent.isActive) throw new NotFoundError("Intención del bot no encontrada");

    return await this.botIntentRepository.update(id, {
      code: data.code ? data.code.trim().toUpperCase() : intent.code,
      name: data.name ?? intent.name,
      description: data.description !== undefined ? data.description : intent.description,
      isActive: data.isActive ?? intent.isActive
    });
  }
}

module.exports = ActualizarBotIntent;