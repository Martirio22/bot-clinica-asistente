const AiBotEvent = require("../Dominio/Entidades/AiBotEvent");
const AiBotEventModel = require("./AiBotEventModel");
const ChatSessionModel = require("../../ChatSessions/Infraestructura/ChatSessionModel");
const BotIntentModel = require("../../BotIntents/Infraestructura/BotIntentModel");
const SpecialtyModel = require("../../../Clinic/Specialties/Infraestructura/SpecialtyModel");

const FULL_INCLUDE = [
  { model: ChatSessionModel, as: "chatSession" },
  { model: BotIntentModel, as: "botIntent" },
  { model: SpecialtyModel, as: "suggestedSpecialty" }
];

class AiBotEventRepositorySequelize {
  
  toDomain(model) {
    if (!model) return null;
    const plain = model.toJSON ? model.toJSON() : model;
    return new AiBotEvent(plain);
  }

  async findById(id) {
    const data = await AiBotEventModel.findByPk(id, { include: FULL_INCLUDE });
    return this.toDomain(data);
  }

  async create(eventData) {
    const created = await AiBotEventModel.create(eventData);
    return this.findById(created.id);
  }

  async update(id, data) {
    await AiBotEventModel.update(data, { where: { id } });
    return this.findById(id);
  }

  async findAll(filters = {}) {
    const where = { }; // Por defecto solo trae registros activos
    
    if (filters.chatSessionId) where.chatSessionId = filters.chatSessionId;
    if (filters.botIntentId) where.botIntentId = filters.botIntentId;
    if (filters.requiresHuman !== undefined) where.requiresHuman = filters.requiresHuman;

    const data = await AiBotEventModel.findAll({
      where,
      include: FULL_INCLUDE,
      order: [["eventDate", "DESC"]]
    });
    return data.map(item => this.toDomain(item));
  }
}

module.exports = AiBotEventRepositorySequelize;