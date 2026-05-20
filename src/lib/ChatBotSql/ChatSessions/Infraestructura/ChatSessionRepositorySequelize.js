const ChatSession = require("../Dominio/Entidades/ChatSession");
const ChatSessionModel = require("./ChatSessionModel");
const PatientModel = require("../../../Clinic/Patients/Infraestructura/PatientModel");
const ChatSessionStatusModel = require("../../ChatSessionStatus/Infraestructura/ChatSessionStatusModel");
const AssistantModel = require("../../../Clinic/ClinicalAssistants/Infraestructura/ClinicalAssistantModel"); 
const WhatsappLineModel = require("../../WhatsAppLines/Infraestructura/WhatsappLineModel");

const FULL_INCLUDE = [
  { model: PatientModel, as: "patient" },
  { model: ChatSessionStatusModel, as: "status" },
  { model: AssistantModel, as: "assignedAssistant" },
  { model: WhatsappLineModel, as: "whatsappLine" }
];

class ChatSessionRepositorySequelize {
  
  toDomain(model) {
    if (!model) return null;
    const plain = model.toJSON ? model.toJSON() : model;
    return new ChatSession(plain);
  }

  async findById(id) {
    const data = await ChatSessionModel.findByPk(id, { include: FULL_INCLUDE });
    return this.toDomain(data);
  }

  async findStatusByCode(code) {
    const status = await ChatSessionStatusModel.findOne({ where: { code } });
    return status ? status.id : null;
  }

  async create(sessionData) {
    const created = await ChatSessionModel.create(sessionData);
    // Retornamos la sesión completamente armada con sus relaciones
    return this.findById(created.id);
  }

  async update(id, data) {
    await ChatSessionModel.update(data, { where: { id } });
    // Al igual que en create, re-consultamos para traer todo el objeto anidado actualizado
    return this.findById(id);
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.sessionStatusId) where.sessionStatusId = filters.sessionStatusId;
    if (filters.handledByBot !== undefined) where.handledByBot = filters.handledByBot;

    const data = await ChatSessionModel.findAll({
      where,
      include: FULL_INCLUDE,
      order: [["startDate", "DESC"]]
    });
    return data.map(item => this.toDomain(item));
  }
}

module.exports = ChatSessionRepositorySequelize;