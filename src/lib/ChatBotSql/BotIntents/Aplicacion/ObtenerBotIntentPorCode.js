const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerBotIntentPorCode {
  constructor(botIntentRepository) {
    this.botIntentRepository = botIntentRepository;
  }

  async ejecutar(code) {
    const intent = await this.botIntentRepository.findByCode(code);
    if (!intent || !intent.isActive) throw new NotFoundError(`Intención del bot con código '${code}' no encontrada`);
    return intent;
  }
}

module.exports = ObtenerBotIntentPorCode;