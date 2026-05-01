const ChatMessage = require("../Dominio/Entidades/ChatMessage");
const ChatMessageModel = require("./ChatMessageModel");
class ChatMessageRepositoryMongoose {
  toDomain(doc) {
    const p = doc.toJSON ? doc.toJSON() : doc;
    return new ChatMessage({ id:p._id.toString(), chatSessionId:p.chatSessionId, patientId:p.patientId, whatsappLineId:p.whatsappLineId, appointmentId:p.appointmentId, sender:p.sender, contentType:p.contentType, messageText:p.messageText, mediaUrl:p.mediaUrl, whatsappMessageId:p.whatsappMessageId, metadata:p.metadata, createdAt:p.createdAt });
  }
  async save(message) {
    const doc = await ChatMessageModel.create({ chatSessionId:message.chatSessionId, patientId:message.patientId, whatsappLineId:message.whatsappLineId, appointmentId:message.appointmentId, sender:message.sender, contentType:message.contentType, messageText:message.messageText, mediaUrl:message.mediaUrl, whatsappMessageId:message.whatsappMessageId, metadata:message.metadata });
    return this.toDomain(doc);
  }
  async findById(id) { const doc = await ChatMessageModel.findById(id); return doc ? this.toDomain(doc) : null; }
  async findByChatSessionId(chatSessionId) { const docs = await ChatMessageModel.find({ chatSessionId }).sort({ createdAt: 1 }); return docs.map(d => this.toDomain(d)); }
}
module.exports = ChatMessageRepositoryMongoose;
