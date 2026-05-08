const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarAppointment {
  constructor(appointmentRepo, doctorRepo) {
    this.appointmentRepo = appointmentRepo;
    this.doctorRepo = doctorRepo;
  }

  async ejecutar(id, data) {
    const appointment = await this.appointmentRepo.findById(id);
    if (!appointment) throw new NotFoundError("Cita no encontrada");

    const doctor = await this.doctorRepo.findById(appointment.doctorId);
    const duracion = doctor.appointmentDurationMinutes;

    const startStr = data.startDate || appointment.startDate;
    const newStart = new Date(startStr);
    const newEnd = new Date(newStart.getTime() + duracion * 60000);

    const formatToEcuadorISO = (date) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}-05:00`;
    };

    const updateData = {
      startDate: startStr.includes('-05:00') ? startStr : formatToEcuadorISO(newStart),
      endDate: formatToEcuadorISO(newEnd),
      statusId: data.statusId ?? appointment.statusId,
      reason: data.reason ?? appointment.reason,
      observation: data.observation ?? appointment.observation,
      officeId: data.officeId ?? appointment.officeId,
      isActive: data.isActive ?? appointment.isActive
    };

    await this.appointmentRepo.update(id, updateData);
    
    return await this.appointmentRepo.findById(id);
  }
}

module.exports = ActualizarAppointment;