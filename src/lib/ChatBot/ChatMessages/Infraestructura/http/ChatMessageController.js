class ChatMessageController {
  constructor({ crear, listarPorSession }) { this.crearUseCase = crear; this.listarPorSessionUseCase = listarPorSession; }
  crear = async (req, res) => { const data = await this.crearUseCase.ejecutar(req.body); res.status(201).json({ success:true, data }); };
  listarPorSession = async (req, res) => { const data = await this.listarPorSessionUseCase.ejecutar(req.params.chatSessionId); res.json({ success:true, data }); };
}
module.exports = ChatMessageController;
