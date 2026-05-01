const MessageDeliveryLog = require("../Dominio/Entidades/MessageDeliveryLog");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
class CrearMessageDeliveryLog {
  constructor(deliveryRepository, chatMessageRepository) { this.deliveryRepository = deliveryRepository; this.chatMessageRepository = chatMessageRepository; }
  async ejecutar(data) {
    // Mongo ↔ Mongo: validamos que el chatMessage exista antes de guardar el log.
    const message = await this.chatMessageRepository.findById(data.chatMessageId);
    if (!message) throw new NotFoundError("ChatMessage no existe en MongoDB");
    const log = new MessageDeliveryLog({ ...data, chatSessionId: data.chatSessionId || message.chatSessionId });
    return await this.deliveryRepository.save(log);
  }
}
module.exports = CrearMessageDeliveryLog;
