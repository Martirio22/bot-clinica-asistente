const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarWhatsappLine {
  constructor(whatsappLineRepository) {
    this.whatsappLineRepository = whatsappLineRepository;
  }

  async ejecutar(id) {
    const line = await this.whatsappLineRepository.findById(id);
    if (!line) throw new NotFoundError("Línea de WhatsApp no encontrada");

    await this.whatsappLineRepository.softDelete(id);
  }
}

module.exports = EliminarWhatsappLine;