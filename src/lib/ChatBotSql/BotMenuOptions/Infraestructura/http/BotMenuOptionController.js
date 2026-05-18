class BotMenuOptionController {
  constructor({ crear, listarPorMenu, obtener, actualizar, eliminar }) {
    this.crearUC = crear;
    this.listarPorMenuUC = listarPorMenu;
    this.obtenerUC = obtener;
    this.actualizarUC = actualizar;
    this.eliminarUC = eliminar;
  }

  crear = async (req, res) => {
    const data = await this.crearUC.ejecutar(req.body);
    res.status(201).json({ success: true, data });
  };

  listarPorMenu = async (req, res) => {
    const { menuBotId } = req.params;
    const data = await this.listarPorMenuUC.ejecutar(menuBotId);
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
    res.json({ success: true, message: "Opción de menú desactivada correctamente" });
  };
}

module.exports = BotMenuOptionController;