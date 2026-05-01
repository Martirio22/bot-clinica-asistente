const ChatMessage = require("../Dominio/Entidades/ChatMessage");

class CrearChatMessage {
  constructor(chatMessageRepository, validators = {}) {
    this.chatMessageRepository = chatMessageRepository;
    this.validators = validators;
  }

  async ejecutar(data) {
    // PostgreSQL ↔ MongoDB:
    // Aquí puedes validar IDs contra repositorios PostgreSQL cuando tengas esos módulos.
    // Ejemplo:
    // if (this.validators.chatSessionRepository) {
    //   const session = await this.validators.chatSessionRepository.findById(data.chatSessionId);
    //   if (!session) throw new Error("La sesión de chat no existe en PostgreSQL");
    // }
    const message = new ChatMessage(data);
    return await this.chatMessageRepository.save(message);
  }
}
module.exports = CrearChatMessage;
