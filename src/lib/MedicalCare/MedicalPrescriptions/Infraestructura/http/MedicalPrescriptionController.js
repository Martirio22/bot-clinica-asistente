class MedicalPrescriptionController {
  constructor({ crear, enviarWhatsapp, listar, obtener, actualizar, eliminar }) {
    this.crearUC = crear;
    this.enviarWhatsappUC = enviarWhatsapp;
    this.listarUC = listar;
    this.obtenerUC = obtener;
    this.actualizarUC = actualizar;
    this.eliminarUC = eliminar;
  }

  crear = async (req, res) => {
    const userId = req.user.sub;
    const data = await this.crearUC.ejecutar(req.body, userId);
    res.status(201).json({ success: true, data });
  };

  enviarWhatsapp = async (req, res) => {
    const userId = req.user.sub;
    const data = await this.enviarWhatsappUC.ejecutar(req.params.id, userId);
    res.json({ success: true, data, message: "Estado de envío actualizado" });
  };

  listar = async (req, res) => {
    const userId = req.user.sub;
    const data = await this.listarUC.ejecutar(userId);
    res.json({ success: true, data });
  };

  obtener = async (req, res) => {
    const userId = req.user.sub;
    const data = await this.obtenerUC.ejecutar(req.params.id, userId);
    res.json({ success: true, data });
  };

  actualizar = async (req, res) => {
    const userId = req.user.sub;
    const data = await this.actualizarUC.ejecutar(req.params.id, req.body, userId);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    const userId = req.user.sub;
    await this.eliminarUC.ejecutar(req.params.id, userId);
    res.json({ success: true, message: "Receta eliminada correctamente" });
  };
}

module.exports = MedicalPrescriptionController;