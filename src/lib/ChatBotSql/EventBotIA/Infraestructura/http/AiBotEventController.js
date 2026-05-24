class AiBotEventController {
  constructor({ crear, listar, obtener, actualizar, eliminar }) {
    this.createUseCase = crear;
    this.listUseCase = listar;
    this.getUseCase = obtener;
    this.updateUseCase = actualizar;
    this.deleteUseCase = eliminar;
  }

  crear = async (req, res) => {
    const data = await this.createUseCase.ejecutar(req.body);
    res.status(201).json({ success: true, data });
  };

  listar = async (req, res) => {
    const filters = {
      chatSessionId: req.query.chatSessionId,
      botIntentId: req.query.botIntentId,
      requiresHuman: req.query.requiresHuman !== undefined ? req.query.requiresHuman === 'true' : undefined
    };
    const data = await this.listUseCase.ejecutar(filters);
    res.json({ success: true, data });
  };

  obtener = async (req, res) => {
    const data = await this.getUseCase.ejecutar(req.params.id);
    res.json({ success: true, data });
  };

  actualizar = async (req, res) => {
    const data = await this.updateUseCase.ejecutar(req.params.id, req.body);
    res.json({ success: true, data, message: "Evento actualizado correctamente" });
  };

  eliminar = async (req, res) => {
    await this.deleteUseCase.ejecutar(req.params.id);
    res.json({ success: true, message: "Evento eliminado correctamente (Desactivado)" });
  };
}

module.exports = AiBotEventController;