const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarWhatsappLine {
  constructor(whatsappLineRepository) {
    this.whatsappLineRepository = whatsappLineRepository;
  }

  async ejecutar(id, data) {
    const line = await this.whatsappLineRepository.findById(id);
    if (!line) throw new NotFoundError("Línea de WhatsApp no encontrada");

    return await this.whatsappLineRepository.update(id, {
      name: data.name ?? line.name,
      phone: data.phone ?? line.phone,
      description: data.description ?? line.description,
      isActive: data.isActive ?? line.isActive,
      isConnected: data.isConnected ?? line.isConnected,
      lastConnectionDate: data.lastConnectionDate ?? line.lastConnectionDate
    });
  }
}

module.exports = ActualizarWhatsappLine;