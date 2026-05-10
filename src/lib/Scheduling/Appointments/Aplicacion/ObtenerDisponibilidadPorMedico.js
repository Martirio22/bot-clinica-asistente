class ObtenerDisponibilidadMedico {
  constructor(appointmentRepo, scheduleRepo, blockingRepo, doctorRepo) {
    this.appointmentRepo = appointmentRepo;
    this.scheduleRepo = scheduleRepo;
    this.blockingRepo = blockingRepo;
    this.doctorRepo = doctorRepo;
  }

  async ejecutar(doctorId, fecha) {
    const doctor = await this.doctorRepo.findById(doctorId);
    if (!doctor) throw new Error("Médico no encontrado");

    const diaSemana = new Date(`${fecha}T12:00:00`).getDay(); 
    const horarios = await this.scheduleRepo.findAllByDoctor(doctorId);
    const horarioHoy = horarios.find(h => h.dayOfWeek === diaSemana && h.isActive);

    if (!horarioHoy) return { doctorId, fecha, slots: [] };

    const [citas, bloqueos] = await Promise.all([
      this.appointmentRepo.findAll({ doctorId, date: fecha }),
      this.blockingRepo.findAll({ doctorId, date: fecha })
    ]);

    const slots = [];
    const duracionMs = doctor.appointmentDurationMinutes * 60000;
    
    let current = new Date(`${fecha}T${horarioHoy.startTime}-05:00`);
    const end = new Date(`${fecha}T${horarioHoy.endTime}-05:00`);

    while (current.getTime() + duracionMs <= end.getTime()) {
      const slotInicio = current.getTime();
      const slotFin = current.getTime() + duracionMs;

      if (!this._hayConflicto(slotInicio, slotFin, citas, bloqueos)) {
        slots.push({
          inicio: new Date(slotInicio).toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' }),
          fin: new Date(slotFin).toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' })
        });
      }

      current = new Date(current.getTime() + duracionMs);
    }

    return {doctorId, fecha, duracionCita: doctor.appointmentDurationMinutes, sucursalId: horarioHoy.branchId, consultorioId: horarioHoy.officeId, slots };
  }

  _hayConflicto(slotIniMs, slotFinMs, citas, bloqueos) {
    const revisar = (r) => {
      const rIni = new Date(r.startDate).getTime();
      const rFin = new Date(r.endDate).getTime();
      return (slotIniMs < rFin && slotFinMs > rIni);
    };

    return citas.some(revisar) || bloqueos.some(revisar);
  }
}

module.exports = ObtenerDisponibilidadMedico;