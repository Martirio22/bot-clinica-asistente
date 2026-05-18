const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerWhatsappLinePorId {
  constructor(whatsappLineRepository) {
    this.whatsappLineRepository = whatsappLineRepository;
  }

  async ejecutar(id) {
    const line = await this.whatsappLineRepository.findById(id);
    if (!line || !line.isActive) throw new NotFoundError("Línea de WhatsApp no encontrada o inactiva");
    return line;
  }
}

module.exports = ObtenerWhatsappLinePorId;