class MedicalAttentionController {
  constructor({ iniciar, finalizar, eliminar, obtener }) {
    this.iniciarUC = iniciar;
    this.finalizarUC = finalizar;
    this.eliminarUC = eliminar;
    this.obtenerUC = obtener;
  }

  iniciar = async (req, res) => {
    const doctorId = req.user.sub; 
    const data = await this.iniciarUC.ejecutar(req.body, doctorId);
    res.status(201).json({ success: true, data });
  };

  finalizar = async (req, res) => {
    const data = await this.finalizarUC.ejecutar(req.params.id, req.body);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    await this.eliminarUC.ejecutar(req.params.id);
    res.json({ success: true, message: "Atención cancelada" });
  };
}
module.exports = MedicalAttentionController;