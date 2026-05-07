class DoctorController {
  constructor({ crear, listar, obtener, actualizar, eliminar }) {
    this.crearUseCase = crear;
    this.listarUseCase = listar;
    this.obtenerUseCase = obtener;
    this.actualizarUseCase = actualizar;
    this.eliminarUseCase = eliminar;
  }

  crear = async (req, res) => {
    try {
      const resultado = await this.crearUseCase.ejecutar(req.body);
      res.status(201).json({ success: true, data: resultado });
    } catch (error) {
      res.status(error.status || 400).json({ 
        success: false, 
        message: error.message 
      });
    }
  };

  listar = async (req, res) => {
    const data = await this.listarUseCase.ejecutar();
    res.json({ success: true, data });
  };

  obtener = async (req, res) => {
    const data = await this.obtenerUseCase.ejecutar(req.params.id);
    res.json({ success: true, data });
  };

  actualizar = async (req, res) => {
    const data = await this.actualizarUseCase.ejecutar(req.params.id, req.body);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    await this.eliminarUseCase.ejecutar(req.params.id);
    res.json({ success: true, message: "Médico desactivado" });
  };
}

module.exports = DoctorController;