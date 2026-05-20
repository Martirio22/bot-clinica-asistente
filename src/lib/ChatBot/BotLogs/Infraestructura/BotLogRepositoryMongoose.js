const BotLog = require("../Dominio/Entidades/BotLog");
const BotLogModel = require("./BotLogModel");

class BotLogRepositoryMongoose {
  toDomain(doc) {
    const p = doc.toJSON ? doc.toJSON() : doc;
    return new BotLog({
      id: p._id.toString(),
      level: p.level,
      module: p.module,
      message: p.message,
      chatSessionId: p.chatSessionId,
      error: p.error,
      createdAt: p.createdAt
    });
  }

  async save(log) {
    const doc = await BotLogModel.create({
      level: log.level,
      module: log.module,
      message: log.message,
      chatSessionId: log.chatSessionId,
      error: log.error
    });
    return this.toDomain(doc);
  }

  async findBySessionId(chatSessionId) {
    const docs = await BotLogModel.find({ chatSessionId }).sort({ createdAt: -1 });
    return docs.map(d => this.toDomain(d));
  }
}

module.exports = BotLogRepositoryMongoose;