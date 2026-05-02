const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarBranch {
    constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async ejecutar(id, data) {
    const b = await this.branchRepository.findById(id);
    if (!b) throw new NotFoundError("Sucursal no encontrada");

    return await this.branchRepository.update(id, {
      name: data.name ?? b.name,
      address: data.address ?? b.address,
      city: data.city ?? b.city,
      phone: data.phone ?? b.phone,
      latitude: data.latitude ?? b.latitude,
      longitude: data.longitude ?? b.longitude,
      isActive: data.isActive ?? b.isActive
    });
  }
}

module.exports = ActualizarBranch;