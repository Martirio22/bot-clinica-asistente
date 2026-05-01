const MessageDeliveryLog = require("../Dominio/Entidades/MessageDeliveryLog");
const MessageDeliveryLogModel = require("./MessageDeliveryLogModel");
class MessageDeliveryLogRepositoryMongoose {
  toDomain(doc) { const p = doc.toJSON ? doc.toJSON() : doc; return new MessageDeliveryLog({ id:p._id.toString(), chatMessageId:p.chatMessageId.toString(), chatSessionId:p.chatSessionId, whatsappMessageId:p.whatsappMessageId, status:p.status, error:p.error, metadata:p.metadata, createdAt:p.createdAt }); }
  async save(log) { const doc = await MessageDeliveryLogModel.create({ chatMessageId:log.chatMessageId, chatSessionId:log.chatSessionId, whatsappMessageId:log.whatsappMessageId, status:log.status, error:log.error, metadata:log.metadata }); return this.toDomain(doc); }
  async findByChatMessageId(chatMessageId) { return await MessageDeliveryLogModel.find({ chatMessageId }).populate("chatMessageId").sort({ createdAt: -1 }); }
}
module.exports = MessageDeliveryLogRepositoryMongoose;
