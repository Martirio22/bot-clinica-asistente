class OfficeController {
  constructor({ crear, listar, obtener, listarPorBranch, actualizar, eliminar }) {
    this.crearUseCase = crear;
    this.listarUseCase = listar;
    this.obtenerUseCase = obtener;
    this.listarPorBranchUseCase = listarPorBranch;
    this.actualizarUseCase = actualizar;
    this.eliminarUseCase = eliminar;
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

  listarPorBranch = async (req, res) => {
  const { branchId } = req.params;
  const data = await this.listarPorBranchUseCase.ejecutar(branchId);
  res.json({ success: true, data });
};

  actualizar = async (req, res) => {
    const data = await this.actualizarUseCase.ejecutar(req.params.id, req.body);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    await this.eliminarUseCase.ejecutar(req.params.id);
    res.json({ success: true, message: "Consultorio desactivado" });
  };
}

module.exports = OfficeController;