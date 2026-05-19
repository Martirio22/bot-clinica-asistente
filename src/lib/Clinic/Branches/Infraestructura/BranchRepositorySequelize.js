const Branch = require("../Dominio/Entidades/Branch");
const BranchModel = require("./BranchModel");
const OfficeModel = require("../../Offices/Infraestructura/OfficeModel");

class BranchRepositorySequelize {

    toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new Branch({
      id: plain.id,
      name: plain.name,
      address: plain.address,
      city: plain.city,
      phone: plain.phone,
      latitude: plain.latitude,
      longitude: plain.longitude,
      isActive: plain.isActive
    });
  }

  async create(branch) {
    const created = await BranchModel.create({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      latitude: branch.latitude,
      longitude: branch.longitude,
      isActive: branch.isActive
    });
    return this.toDomain(created);
  }

  async update(id, data) {
    await BranchModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await BranchModel.update({ isActive: false }, { where: { id } });
  }

  async findById(id) {
    const branch = await BranchModel.findByPk(id);
    return branch ? this.toDomain(branch) : null;
  }

  async findAll() {
    const branches = await BranchModel.findAll({
      order: [["createdAt", "DESC"]]
    });

    return branches.map(b => this.toDomain(b));
  }
}

module.exports = BranchRepositorySequelize;