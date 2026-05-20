class ConversationContextController {
  constructor({ actualizar, obtenerPorSession }) {
    this.actualizarUseCase = actualizar;
    this.obtenerPorSessionUseCase = obtenerPorSession;
  }

  actualizar = async (req, res) => {
    const data = await this.actualizarUseCase.ejecutar(req.body);
    res.status(200).json({ success: true, data });
  };

  obtenerPorSession = async (req, res) => {
    const data = await this.obtenerPorSessionUseCase.ejecutar(req.params.chatSessionId);
    res.json({ success: true, data });
  };
}

module.exports = ConversationContextController;