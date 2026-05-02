const Office = require("../Dominio/Entidades/Office");
const OfficeModel = require("./OfficeModel");
const BranchModel = require("../../Branches/Infraestructura/BranchModel");

class OfficeRepositorySequelize {

    toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;

    return new Office({
      id: plain.id,
      branchId: plain.branchId,
      code: plain.code,
      name: plain.name,
      floor: plain.floor,
      isActive: plain.isActive,
       branch: plain.branch
      ? {
          id: plain.branch.id,
          name: plain.branch.name,
          city: plain.branch.city
        }
      : null
    });
  }

  async create(office) {
    const created = await OfficeModel.create({
      branchId: office.branchId,
      code: office.code,
      name: office.name,
      floor: office.floor,
      isActive: office.isActive
    });

    return this.toDomain(created);
  }

  async update(id, data) {
    await OfficeModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await OfficeModel.update({ isActive: false }, { where: { id } });
  }

  async findById(id) {
    const office = await OfficeModel.findByPk(id, {
      include: [{ model: BranchModel, as: "branch" }]
    });

    return office ? this.toDomain(office) : null;
  }

  async findAll() {
  const offices = await OfficeModel.findAll({
    include: [{ model: BranchModel, as: "branch" }],
    raw: false
  });

  return offices.map(o => this.toDomain(o));
}

  async findByCodeAndBranch(code, branchId) {
    const office = await OfficeModel.findOne({
      where: { code, branchId }
    });

    return office ? this.toDomain(office) : null;
  }
  
}
console.log("BRANCH MODEL INSTANCE REPO:", BranchModel);
module.exports = OfficeRepositorySequelize;