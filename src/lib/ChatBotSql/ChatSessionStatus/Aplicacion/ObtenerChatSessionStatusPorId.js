const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerChatSessionStatusPorId {
  constructor(statusRepository) {
    this.statusRepository = statusRepository;
  }

  async ejecutar(id) {
    const status = await this.statusRepository.findById(id);
    if (!status || !status.isActive) throw new NotFoundError("Estado de sesión no encontrado");
    return status;
  }
}

module.exports = ObtenerChatSessionStatusPorId;