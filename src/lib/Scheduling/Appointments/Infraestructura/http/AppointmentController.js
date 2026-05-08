class AppointmentController {
  constructor({ crear, listar, obtener, disponibilidad, actualizar, eliminar }) {
    this.crearUC = crear;
    this.listarUC = listar;
    this.obtenerUC = obtener;
    this.disponibilidadUC = disponibilidad;
    this.actualizarUC = actualizar;
    this.eliminarUC = eliminar;
  }

crear = async (req, res, config = {}) => {
    
    const esBot = config.esBot || !req.user;
    const appointmentData = {
      ...req.body,
      createdByUserId: esBot ? null : (req.user.id || req.user.sub),
      isCreatedByBot: esBot,
      origin: esBot ? 'WHATSAPP' : 'WEB',
    };

    const data = await this.crearUC.ejecutar(appointmentData);
    res.status(201).json({ 
      success: true, 
      message: `Cita agendada exitosamente desde ${appointmentData.origin}`,
      data 
    });
};

  listar = async (req, res) => {
    const filters = {
      doctorId: req.query.doctorId,
      patientId: req.query.patientId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    const data = await this.listarUC.ejecutar(filters);
    res.json({ success: true, data });
  };

  obtener = async (req, res) => {
    const data = await this.obtenerUC.ejecutar(req.params.id);
    res.json({ success: true, data });
  };

  disponibilidad = async (req, res) => {
    const { doctorId, fecha } = req.query;
    if (!doctorId || !fecha) {
        return res.status(400).json({ 
            success: false, 
            message: "doctorId y fecha son requeridos" 
        });
    }
    const data = await this.disponibilidadUC.ejecutar(doctorId, fecha);
    res.json({ success: true, data });
};

  actualizar = async (req, res) => {
    const data = await this.actualizarUC.ejecutar(req.params.id, req.body);
    res.json({ success: true, data });
  };

  eliminar = async (req, res) => {
    await this.eliminarUC.ejecutar(req.params.id);
    res.json({ success: true, message: "Cita eliminada correctamente" });
  };
}

module.exports = AppointmentController;