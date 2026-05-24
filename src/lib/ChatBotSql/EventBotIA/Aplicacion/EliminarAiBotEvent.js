const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarAiBotEvent {
  constructor(aiBotEventRepository) {
    this.aiBotEventRepo = aiBotEventRepository;
  }

  async ejecutar(id) {
    const existe = await this.aiBotEventRepo.findById(id);
    if (!existe) throw new NotFoundError("Evento de IA del bot no encontrado");

    return await this.aiBotEventRepo.update(id, { isActive: false });
  }
}

module.exports = EliminarAiBotEvent;