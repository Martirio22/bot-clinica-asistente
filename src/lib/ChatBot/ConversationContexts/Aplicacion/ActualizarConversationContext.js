const ConversationContext = require("../Dominio/Entidades/ConversationContext");

class ActualizarContexto {
  constructor(contextRepository) {
    this.contextRepository = contextRepository;
  }

  async ejecutar(data) {
    const contexto = new ConversationContext(data);
    return await this.contextRepository.save(contexto);
  }
}

module.exports = ActualizarContexto;