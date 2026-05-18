class ChatSessionStatusController {
  constructor({ crear, listar, obtener, actualizar, eliminar, obtenerPorCodigo }) {
    this.crearUseCase = crear;
    this.listarUseCase = listar;
    this.obtenerUseCase = obtener;
    this.actualizarUseCase = actualizar;
    this.eliminarUseCase = eliminar;
    this.obtenerPorCodigoUseCase = obtenerPorCodigo;
  }

  crear = async (req, res) => {
    const data = await this.crearUseCase.ejecutar(req.body);
    res.status(201).json({ success: true, data });
  };

  listar = async (req, res) => {
    const data = await this.listarUseCase.ejecutar();
    res.json({ success: true, data });
  };

  obtener = async (req, res) => {
    const data = await this.obtenerUseCase.ejecutar(req.params.id);
    res.json({ success: true, data });
  };

  obtenerPorCodigo = async (req, res) => {
    const data = await this.obtenerPorCodigoUseCase.ejecutar(req.params.code);
    res.json({ success: true, data });
  };

  actualizar = async (req, res) => {
    const data = await this.actualizarUseCase.ejecutar(req.params.id, req.body);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    await this.eliminarUseCase.ejecutar(req.params.id);
    res.json({ success: true, message: "Estado de sesión desactivado correctamente" });
  };
}

module.exports = ChatSessionStatusController;