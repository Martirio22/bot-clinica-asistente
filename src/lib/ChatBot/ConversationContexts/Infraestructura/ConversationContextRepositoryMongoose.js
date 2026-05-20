const ConversationContext = require("../Dominio/Entidades/ConversationContext");
const ConversationContextModel = require("./ConversationContextModel");

class ConversationContextRepositoryMongoose {
  toDomain(doc) {
    if (!doc) return null;
    const p = doc.toJSON ? doc.toJSON() : doc;
    return new ConversationContext({
      id: p._id.toString(),
      chatSessionId: p.chatSessionId,
      currentStep: p.currentStep,
      lastIntent: p.lastIntent,
      temporaryData: p.temporaryData,
      updatedAt: p.updatedAt
    });
  }

  async save(context) {
    const doc = await ConversationContextModel.findOneAndUpdate(
      { chatSessionId: context.chatSessionId },
      { 
        currentStep: context.currentStep,
        lastIntent: context.lastIntent,
        temporaryData: context.temporaryData
      },
      { new: true, upsert: true }
    );
    return this.toDomain(doc);
  }

  async findByChatSessionId(chatSessionId) {
    const doc = await ConversationContextModel.findOne({ chatSessionId });
    return this.toDomain(doc);
  }
}

module.exports = ConversationContextRepositoryMongoose;