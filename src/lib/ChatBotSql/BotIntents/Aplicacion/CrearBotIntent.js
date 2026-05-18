const BotIntent = require("../Dominio/Entidades/BotIntent");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearBotIntent {
  constructor(botIntentRepository) {
    this.botIntentRepository = botIntentRepository;
  }

  async ejecutar(data) {
    const nuevaIntencion = new BotIntent({ ...data, isActive: true });
    
    const intencionExistente = await this.botIntentRepository.findByCode(nuevaIntencion.code);
    if (intencionExistente) {
      throw new ConflictError(`El código de intención '${nuevaIntencion.code}' ya existe.`);
    }

    return await this.botIntentRepository.create(nuevaIntencion);
  }
}

module.exports = CrearBotIntent;