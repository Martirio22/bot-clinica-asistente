class MessageDeliveryLogController {
  constructor({ crear, listarPorMessage }) { this.crearUseCase=crear; this.listarPorMessageUseCase=listarPorMessage; }
  crear = async (req,res) => { const data = await this.crearUseCase.ejecutar(req.body); res.status(201).json({success:true,data}); };
  listarPorMessage = async (req,res) => { const data = await this.listarPorMessageUseCase.ejecutar(req.params.chatMessageId); res.json({success:true,data}); };
}
module.exports = MessageDeliveryLogController;
