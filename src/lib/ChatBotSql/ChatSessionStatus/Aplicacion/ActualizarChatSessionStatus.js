const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarChatSessionStatus {
  constructor(statusRepository) {
    this.statusRepository = statusRepository;
  }

  async ejecutar(id, data) {
    const status = await this.statusRepository.findById(id);
    if (!status || !status.isActive) throw new NotFoundError("Estado de sesión no encontrado");

    return await this.statusRepository.update(id, {
      code: data.code ? data.code.trim().toUpperCase() : status.code,
      name: data.name ?? status.name,
      description: data.description !== undefined ? data.description : status.description,
      isActive: data.isActive ?? status.isActive
    });
  }
}

module.exports = ActualizarChatSessionStatus;