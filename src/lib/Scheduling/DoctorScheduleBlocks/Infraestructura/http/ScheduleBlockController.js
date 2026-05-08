class ScheduleBlockController {
  constructor({ crear, listar, obtener, actualizar, eliminar }) {
    this.crearUC = crear;
    this.listarUC = listar;
    this.obtenerUC = obtener;
    this.actualizarUC = actualizar;
    this.eliminarUC = eliminar;
  }

  // ScheduleBlockController.js
crear = async (req, res) => {
  const data = await this.crearUC.ejecutar({
    ...req.body,
    registeredByUserId: req.user.sub || req.user.id 
  });
  res.status(201).json({ success: true, data });
};

  listar = async (req, res) => {
    const { doctorId } = req.query;
    const data = await this.listarUC.ejecutar(doctorId);
    res.json({ success: true, data });
  };

  obtener = async (req, res) => {
    const data = await this.obtenerUC.ejecutar(req.params.id);
    res.json({ success: true, data });
  };

  actualizar = async (req, res) => {
    const data = await this.actualizarUC.ejecutar(req.params.id, req.body);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    await this.eliminarUC.ejecutar(req.params.id);
    res.json({ success: true, message: "Bloqueo eliminado correctamente" });
  };
}

module.exports = ScheduleBlockController;