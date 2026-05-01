class ListarLogsPorChatMessage { constructor(repo){this.repo=repo;} async ejecutar(chatMessageId){return await this.repo.findByChatMessageId(chatMessageId);} }
module.exports = ListarLogsPorChatMessage;
