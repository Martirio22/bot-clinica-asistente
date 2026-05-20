class ListarChatSessions {
  constructor(chatSessionRepository) {
    this.chatSessionRepository = chatSessionRepository;
  }

  async ejecutar() {
    return await this.chatSessionRepository.findAll();
  }
}

module.exports = ListarChatSessions;