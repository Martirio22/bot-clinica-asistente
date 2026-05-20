class ChatSessionController {
  constructor({ crear, listar, obtener, asignarAsistente, cerrar }) {
    this.crearUseCase = crear;
    this.listarUseCase = listar;
    this.obtenerUseCase = obtener;
    this.asignarAsistenteUseCase = asignarAsistente;
    this.cerrarUseCase = cerrar;
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

  asignarAsistente = async (req, res) => {
    const { assistantId } = req.body;
    const data = await this.asignarAsistenteUseCase.ejecutar(req.params.id, assistantId);
    res.json({ 
      success: true, 
      data, 
      message: "Sesión asignada a atención humana correctamente" 
    });
  };

  cerrar = async (req, res) => {
    const data = await this.cerrarUseCase.ejecutar(req.params.id, req.body);
    res.json({ success: true, data, message: "Sesión de chat finalizada con éxito" });
  };
}

module.exports = ChatSessionController;