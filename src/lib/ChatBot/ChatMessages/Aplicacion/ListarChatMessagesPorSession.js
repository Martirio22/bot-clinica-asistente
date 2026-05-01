class ListarChatMessagesPorSession {
  constructor(chatMessageRepository) { this.chatMessageRepository = chatMessageRepository; }
  async ejecutar(chatSessionId) { return await this.chatMessageRepository.findByChatSessionId(chatSessionId); }
}
module.exports = ListarChatMessagesPorSession;
