const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerBotIntentPorId {
  constructor(botIntentRepository) {
    this.botIntentRepository = botIntentRepository;
  }

  async ejecutar(id) {
    const intent = await this.botIntentRepository.findById(id);
    if (!intent || !intent.isActive) throw new NotFoundError("Intención del bot no encontrada");
    return intent;
  }
}

module.exports = ObtenerBotIntentPorId;