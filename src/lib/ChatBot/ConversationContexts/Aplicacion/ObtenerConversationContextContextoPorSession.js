const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerConversationContextContextoPorSession {
  constructor(contextRepository) {
    this.contextRepository = contextRepository;
  }

  async ejecutar(chatSessionId) {
    const contexto = await this.contextRepository.findByChatSessionId(chatSessionId);
    if (!contexto) throw new NotFoundError("Contexto conversacional no encontrado para esta sesión");
    return contexto;
  }
}

module.exports = ObtenerConversationContextContextoPorSession;