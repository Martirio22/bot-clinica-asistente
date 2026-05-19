const MedicalAttention = require("../Dominio/Entidades/MedicalAttention");
const MedicalAttentionModel = require("./MedicalAttentionModel");
const AttentionStatusModel = require("../../AttentionStatus/Infraestructura/AttentionStatusModel");

class MARepositorySequelize {
  toDomain(model) {
  const plain = model.toJSON ? model.toJSON() : model;
  return new MedicalAttention({
    ...plain
  });
}

  async findStatusByCode(code) {
    const status = await AttentionStatusModel.findOne({ where: { code } });
    return status ? status.id : null;
  }

  async create(data) {
    const res = await MedicalAttentionModel.create(data);
    return this.findById(res.id);
  }

  async findById(id) {
    const data = await MedicalAttentionModel.findByPk(id, {
      include: ["appointment", "patient", "doctor", "status"]
    });
    return data ? this.toDomain(data) : null;
  }

  async findAllByDoctor(userId) {
  const data = await MedicalAttentionModel.findAll({
    include: ["patient", "status",
      {association: "doctor", where: { userId: userId }}
    ],
    order: [['startDate', 'DESC']]
  });
  
  return data.map(item => this.toDomain(item));
}

  async findByAppointmentId(appointmentId) {
    const data = await MedicalAttentionModel.findOne({ 
      where: { appointmentId },
      include: ["doctor"]
    });
    return data ? this.toDomain(data) : null;
  }

  async update(id, data) {
    await MedicalAttentionModel.update(data, { where: { id } });
    return this.findById(id);
  }
}
module.exports = MARepositorySequelize;