class BotLogController {
  constructor({ registrar, listarPorSession }) {
    this.registrarUseCase = registrar;
    this.listarPorSessionUseCase = listarPorSession;
  }

  registrar = async (req, res) => {
    const data = await this.registrarUseCase.ejecutar(req.body);
    res.status(201).json({ success: true, data });
  };

  listarPorSession = async (req, res) => {
    const data = await this.listarPorSessionUseCase.ejecutar(req.params.chatSessionId);
    res.json({ success: true, data });
  };
}

module.exports = BotLogController;