const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarChatSessionStatus {
  constructor(statusRepository) {
    this.statusRepository = statusRepository;
  }

  async ejecutar(id) {
    const status = await this.statusRepository.findById(id);
    if (!status) throw new NotFoundError("Estado de sesión no encontrado");

    await this.statusRepository.softDelete(id);
  }
}

module.exports = EliminarChatSessionStatus;