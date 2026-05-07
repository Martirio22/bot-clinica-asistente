const AppointmentStatus = require("../Dominio/Entidades/AppointmentStatus");
const AppointmentStatusModel = require("./AppointmentStatusModel");

class ASRepositorySequelize {

  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;

    return new AppointmentStatus({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      description: plain.description,
      isActive: plain.isActive
    });
  }

  async create(as) {
    const created = await AppointmentStatusModel.create({
      code: as.code,
      name: as.name,
      description: as.description,
      isActive: as.isActive
    });

    return this.toDomain(created);
  }

  async findById(id) {
    const as = await AppointmentStatusModel.findByPk(id);
    return as ? this.toDomain(as) : null;
  }

  async findAll() {
    const as = await AppointmentStatusModel.findAll({
      order: [["createdAt", "DESC"]]
    });

    return as.map(x => this.toDomain(x));
  }

  async update(id, data) {
    await AppointmentStatusModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await AppointmentStatusModel.update({ isActive: false }, { where: { id } });
  }

  async findByCode(code) {
    const r = await AppointmentStatusModel.findOne({ 
      where: { code: code.toUpperCase() } 
    });
    return r ? this.toDomain(r) : null;
  }
}

module.exports = ASRepositorySequelize;