class ObtenerDisponibilidadMedico {
  constructor(appointmentRepo, scheduleRepo, blockingRepo, doctorRepo) {
    this.appointmentRepo = appointmentRepo;
    this.scheduleRepo = scheduleRepo;
    this.blockingRepo = blockingRepo;
    this.doctorRepo = doctorRepo;
  }

  async ejecutar(doctorId, fecha) {
    const doctor = await this.doctorRepo.findById(doctorId);
    if (!doctor) throw new Error("Doctor no encontrado");
    
    const duracionCita = doctor.appointmentDurationMinutes;

    // 1. IMPORTANTE: Forzamos la interpretación local de la fecha
    // fecha viene como '2026-05-15'
    const diaSemana = new Date(`${fecha}T00:00:00`).getDay(); 

    const horariosBase = await this.scheduleRepo.findAllByDoctor(doctorId);
    const horarioHoy = horariosBase.find(h => h.dayOfWeek === diaSemana && h.isActive);

    if (!horarioHoy) return { doctorId, fecha, slots: [] };

    const citasOcupadas = await this.appointmentRepo.findAll({ doctorId, date: fecha });
    const bloqueos = await this.blockingRepo.findAll({ doctorId, date: fecha });

    let slotsDisponibles = [];
    
    // 2. Creamos punteros de tiempo usando el offset local (-05:00)
    // Esto asegura que coincida con lo que PostgreSQL guarda como -05
    let currentPointer = new Date(`${fecha}T${horarioHoy.startTime}-05:00`);
    const limitPointer = new Date(`${fecha}T${horarioHoy.endTime}-05:00`);

    while (new Date(currentPointer.getTime() + duracionCita * 60000) <= limitPointer) {
      const slotInicio = new Date(currentPointer);
      const slotFin = new Date(currentPointer.getTime() + duracionCita * 60000);

      const estaOcupado = this._revisarColision(slotInicio, slotFin, citasOcupadas, bloqueos);

      if (!estaOcupado) {
        slotsDisponibles.push({
          // Mostramos la hora en formato local para entenderlo en Postman
          inicio: slotInicio.toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' }),
          fin: slotFin.toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' })
        });
      }
      
      currentPointer.setMinutes(currentPointer.getMinutes() + duracionCita);
    }

    return {
      doctorId,
      fecha,
      duracionCita,
      sucursal: horarioHoy.branchId,
      slots: slotsDisponibles
    };
  }

  _revisarColision(inicio, fin, citas, bloqueos) {
    const ini = inicio.getTime();
    const f = fin.getTime();

    // Comparamos contra las fechas que vienen de la DB
    const choqueCita = citas.some(c => {
      const cIni = new Date(c.startDate).getTime();
      const cFin = new Date(c.endDate).getTime();
      return (ini < cFin && f > cIni);
    });

    const choqueBloqueo = bloqueos.some(b => {
      const bIni = new Date(b.startDate).getTime();
      const bFin = new Date(b.endDate).getTime();
      return (ini < bFin && f > bIni);
    });

    return choqueCita || choqueBloqueo;
  }
}

module.exports = ObtenerDisponibilidadMedico;