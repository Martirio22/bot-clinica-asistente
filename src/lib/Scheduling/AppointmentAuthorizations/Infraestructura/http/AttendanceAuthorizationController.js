class AttendanceAuthorizationController {
  constructor({ crear, listar, obtener, actualizar, eliminar }) {
    this.crearUC = crear;
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

  listar = async (req, res) => {
    const data = await this.listarUC.ejecutar(req.query);
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
    res.json({ success: true, message: "Registro eliminado" });
  };
}

module.exports = AttendanceAuthorizationController;