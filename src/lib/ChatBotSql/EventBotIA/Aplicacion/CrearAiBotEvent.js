const AiBotEvent = require("../Dominio/Entidades/AiBotEvent");

class CrearAiBotEvent {
  constructor(aiBotEventRepository) {
    this.aiBotEventRepo = aiBotEventRepository;
  }

  async ejecutar(data) {
    const nuevoEvento = new AiBotEvent({
      ...data,
      eventDate: new Date(),
      isActive: true
    });

    return await this.aiBotEventRepo.create(nuevoEvento);
  }
}

module.exports = CrearAiBotEvent;