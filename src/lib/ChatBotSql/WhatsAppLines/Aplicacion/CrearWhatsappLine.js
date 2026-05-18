const WhatsappLine = require("../Dominio/Entidades/WhatsappLine");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearWhatsappLine {
  constructor(whatsappLineRepository) {
    this.whatsappLineRepository = whatsappLineRepository;
  }

  async ejecutar(data) {
    const nuevaLinea = new WhatsappLine({
      ...data,
      isActive: true,
      isConnected: false
    });
    const lineaExistente = await this.whatsappLineRepository.findByPhone(nuevaLinea.phone);
    if (lineaExistente) {
      throw new ConflictError(`El número de teléfono ${nuevaLinea.phone} ya se encuentra registrado.`);
    }

    return await this.whatsappLineRepository.create(nuevaLinea);
  }
}

module.exports = CrearWhatsappLine;