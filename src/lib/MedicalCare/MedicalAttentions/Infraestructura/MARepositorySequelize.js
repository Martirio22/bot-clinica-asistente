const MedicalAttention = require("../Dominio/Entidades/MedicalAttention");
const MedicalAttentionModel = require("./MedicalAttentionModel");
const AttentionStatusModel = require("../../AttentionStatus/Infraestructura/AttentionStatusModel");

class MARepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON();
    return new MedicalAttention(plain);
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

  async findByAppointmentId(appointmentId) {
    const data = await MedicalAttentionModel.findOne({ where: { appointmentId } });
    return data ? this.toDomain(data) : null;
  }

  async update(id, data) {
    await MedicalAttentionModel.update(data, { where: { id } });
    return this.findById(id);
  }
}
module.exports = MARepositorySequelize;