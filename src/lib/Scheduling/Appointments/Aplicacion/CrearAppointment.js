const Appointment = require("../Dominio/Entidades/Appointment");
const ConflictError = require("../../../../shared/errors/ConflictError");
const ValidationError = require("../../../../shared/errors/ValidationError");
const NotFoundError = require("../../../../shared/errors/NotFoundError");

class CrearAppointment {
  constructor(appointmentRepo, doctorRepo, patientRepo, scheduleRepo,blockingRepo, specialtyRepo, branchRepo, officeRepo, statusRepo) {
    this.appointmentRepo = appointmentRepo;
    this.doctorRepo = doctorRepo;
    this.patientRepo = patientRepo;
    this.scheduleRepo = scheduleRepo;
    this.blockingRepo = blockingRepo;
    this.specialtyRepo = specialtyRepo;
    this.branchRepo = branchRepo;
    this.officeRepo = officeRepo;
    this.statusRepo = statusRepo;
  }

  async ejecutar(data) {
    const reservadaStatusId = await this.appointmentRepo.findStatusByCode('RESERVADA');
    if (!reservadaStatusId) throw new NotFoundError("El estado 'RESERVADA' no está configurado");
    const doctor = await this.doctorRepo.findById(data.doctorId);
    if (!doctor || !doctor.isActive) throw new NotFoundError("Médico no encontrado o inactivo");
    const inicio = new Date(data.startDate);
    const finCalculado = new Date(inicio.getTime() + doctor.appointmentDurationMinutes * 60000);
    const nuevaCita = new Appointment({ 
      ...data,  statusId: reservadaStatusId, endDate: finCalculado.toISOString(), isActive: true});

    if (!nuevaCita.officeId) {
      const horario = await this.scheduleRepo.findSchedule(
        nuevaCita.doctorId,
        new Date(nuevaCita.startDate).getDay(),
        nuevaCita.startDate,
        nuevaCita.endDate
      );
      if (horario && horario.officeId) {
        nuevaCita.officeId = horario.officeId;
      }
    }
    const specialty = await this.specialtyRepo.findById(nuevaCita.specialtyId);
    if (!specialty || !specialty.isActive) throw new NotFoundError("Especialidad inválida");
    const branch = await this.branchRepo.findById(nuevaCita.branchId);
    if (!branch || !branch.isActive) throw new NotFoundError("Sucursal inválida");
    const paciente = await this.patientRepo.findById(nuevaCita.patientId);
    if (!paciente || !paciente.isActive) throw new NotFoundError("Paciente no encontrado");
    const status = await this.statusRepo.findById(nuevaCita.statusId);
    if (!status) throw new NotFoundError("Estado de cita no encontrado");
    if (doctor.specialtyId !== nuevaCita.specialtyId) {
       throw new ValidationError("El médico no pertenece a la especialidad");
    }
    if (nuevaCita.officeId) {
      const office = await this.officeRepo.findById(nuevaCita.officeId);
      if (!office || office.branchId !== nuevaCita.branchId) {
        throw new ValidationError("Consultorio no pertenece a la sucursal");
      }
    }
    const trabajaEseDia = await this.scheduleRepo.findSchedule(
      nuevaCita.doctorId,
      new Date(nuevaCita.startDate).getDay(),
      nuevaCita.startDate,
      nuevaCita.endDate
    );
    if (!trabajaEseDia) throw new ValidationError("El médico no atiende en el horario");
    const estaBloqueado = await this.blockingRepo.findOverlap(nuevaCita.doctorId, nuevaCita.startDate, nuevaCita.endDate);
    if (estaBloqueado) throw new ConflictError("El médico tiene un bloqueo");
    const citaSolapada = await this.appointmentRepo.findOverlap(nuevaCita.doctorId, nuevaCita.startDate, nuevaCita.endDate);
    if (citaSolapada) throw new ConflictError("El médico ya tiene otra cita");
    const tieneCitaMismoDia = await this.appointmentRepo.findDuplicatePatientAppointment(nuevaCita.patientId, nuevaCita.specialtyId, nuevaCita.startDate);
    if (tieneCitaMismoDia) throw new ConflictError("El paciente ya tiene cita hoy");
    return await this.appointmentRepo.create(nuevaCita);
  }
}

module.exports = CrearAppointment;