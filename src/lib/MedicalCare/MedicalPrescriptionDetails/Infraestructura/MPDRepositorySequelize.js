const MedicalPrescriptionDetail = require("../Dominio/Entidades/MedicalPrescriptionDetail");
const MedicalPrescriptionDetailModel = require("./MedicalPrescriptionDetailModel");

class MPDRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new MedicalPrescriptionDetail(plain);
  }

  async create(data) {
    const res = await MedicalPrescriptionDetailModel.create(data);
    return this.toDomain(res);
  }

  async findById(id) {
    const res = await MedicalPrescriptionDetailModel.findByPk(id);
    return res ? this.toDomain(res) : null;
  }

  async findByPrescriptionId(medicalPrescriptionId) {
    const items = await MedicalPrescriptionDetailModel.findAll({
      where: { medicalPrescriptionId, isActive: true },
      order: [["order", "ASC"]]
    });
    return items.map(i => this.toDomain(i));
  }

  async findAll() {
  const items = await MedicalPrescriptionDetailModel.findAll({
    where: { isActive: true },
    order: [["createdAt", "DESC"]]
  });
  return items.map(i => this.toDomain(i));
}

  async update(id, data) {
    await MedicalPrescriptionDetailModel.update(data, { where: { id } });
    return this.findById(id);
  }

  async softDelete(id) {
    await MedicalPrescriptionDetailModel.update({ isActive: false }, { where: { id } });
  }
}

module.exports = MPDRepositorySequelize;