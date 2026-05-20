class ListarBotLogsPorSession {
  constructor(botLogRepository) {
    this.botLogRepository = botLogRepository;
  }

  async ejecutar(chatSessionId) {
    return await this.botLogRepository.findBySessionId(chatSessionId);
  }
}

module.exports = ListarBotLogsPorSession;