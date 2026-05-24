const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerAiBotEventPorId {
  constructor(aiBotEventRepository) {
    this.aiBotEventRepo = aiBotEventRepository;
  }

  async ejecutar(id) {
    const evento = await this.aiBotEventRepo.findById(id);
    if (!evento) throw new NotFoundError("Evento de IA del bot no encontrado");
    return evento;
  }
}

module.exports = ObtenerAiBotEventPorId;