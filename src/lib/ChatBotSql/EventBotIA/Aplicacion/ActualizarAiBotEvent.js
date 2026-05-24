const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarAiBotEvent {
  constructor(aiBotEventRepository) {
    this.aiBotEventRepo = aiBotEventRepository;
  }

  async ejecutar(id, dataUpdate) {
    const existe = await this.aiBotEventRepo.findById(id);
    if (!existe) throw new NotFoundError("Evento de IA del bot no encontrado");

    return await this.aiBotEventRepo.update(id, dataUpdate);
  }
}

module.exports = ActualizarAiBotEvent;