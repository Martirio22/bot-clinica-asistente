class MedicalAttentionController {
  constructor({ iniciar, finalizar, eliminar, listar, obtener }) {
    this.iniciarUC = iniciar;
    this.finalizarUC = finalizar;
    this.eliminarUC = eliminar;
    this.listarUC = listar;
    this.obtenerUC = obtener;
    
  }

  iniciar = async (req, res) => {
    const userId = req.user.sub;
    const data = await this.iniciarUC.ejecutar(req.body, userId);
    res.status(201).json({ success: true, data });
  };

  finalizar = async (req, res) => {
    const userId = req.user.sub;
    const data = await this.finalizarUC.ejecutar(req.params.id, req.body, userId);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    const userId = req.user.sub;
    await this.eliminarUC.ejecutar(req.params.id, userId);
    res.json({ success: true, message: "Atención cancelada" });
  };

  listar = async (req, res) => {
  const userId = req.user.sub;
  const data = await this.listarUC.ejecutar(userId);
  res.json({ success: true, data });
};

obtenerPorId = async (req, res) => {
  const userId = req.user.sub;
  const data = await this.obtenerUC.ejecutar(req.params.id, userId);
  res.json({ success: true, data });
};
}

module.exports = MedicalAttentionController;