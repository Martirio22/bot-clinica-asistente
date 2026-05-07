const ClinicalAssistant = require("../Dominio/Entidades/ClinicalAssistant");
const ClinicalAssistantModel = require("./ClinicalAssistantModel");
const SecurityUserModel = require("../../../Security/Users/Infraestructura/UserModel");

class CARepositorySequelize {

  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;

    return new ClinicalAssistant({
      id: plain.id,
      userId: plain.userId,
      canManageChat: plain.canManageChat,
      canScheduleAppointments: plain.canScheduleAppointments,
      canAuthorizeCare: plain.canAuthorizeCare,
      isActive: plain.isActive,
      user: plain.user || null
    });
  }

  async create(assistant) {
    const created = await ClinicalAssistantModel.create({
      userId: assistant.userId,
      canManageChat: assistant.canManageChat,
      canScheduleAppointments: assistant.canScheduleAppointments,
      canAuthorizeCare: assistant.canAuthorizeCare,
      isActive: assistant.isActive
    });

    return this.toDomain(created);
  }

  async findById(id) {
    //if (!id) return null;
    const assistant = await ClinicalAssistantModel.findByPk(id, {
      include: [{ model: SecurityUserModel, as: "user" }]
    });

    return assistant ? this.toDomain(assistant) : null;
  }

  async findAll() {
    const assistant = await ClinicalAssistantModel.findAll({
      include: [{ model: SecurityUserModel, as: "user" }],
      order: [["createdAt", "DESC"]]
    });

    return assistant.map(d => this.toDomain(d));
  }

  async findByUserId(userId) {
  const data = await ClinicalAssistantModel.findOne({
    where: { userId }
  });

  return data ? this.toDomain(data) : null;
}

  async update(id, data) {
    await ClinicalAssistantModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await ClinicalAssistantModel.update({ isActive: false }, { where: { id } });
  }
}

module.exports = CARepositorySequelize;