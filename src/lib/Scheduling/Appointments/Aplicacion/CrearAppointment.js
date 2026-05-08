const Appointment = require("../Dominio/Entidades/Appointment");
const ConflictError = require("../../../../shared/errors/ConflictError");
const ValidationError = require("../../../../shared/errors/ValidationError");
const NotFoundError = require("../../../../shared/errors/NotFoundError");

class CrearAppointment {
  constructor(
    appointmentRepo, doctorRepo, patientRepo, scheduleRepo,
    blockingRepo, specialtyRepo, branchRepo, officeRepo, statusRepo
  ) {
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
    // 1. Obtener al médico primero para conocer su duración de cita
    const doctor = await this.doctorRepo.findById(data.doctorId);
    if (!doctor || !doctor.isActive) throw new NotFoundError("Médico no encontrado o inactivo");

    // 2. Calcular el endDate automáticamente basado en la duración del médico
    const inicio = new Date(data.startDate);
    const finCalculado = new Date(inicio.getTime() + doctor.appointmentDurationMinutes * 60000);
    
    // 3. Crear la instancia de la entidad con el endDate calculado
    // Esto no daña tu entidad, solo asegura que los datos sean consistentes
    const nuevaCita = new Appointment({ 
      ...data, 
      endDate: finCalculado.toISOString() 
    });

    // 4. Asignar consultorio automáticamente si no viene en el data
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

    // --- VALIDACIONES DE INTEGRIDAD ---
    const specialty = await this.specialtyRepo.findById(nuevaCita.specialtyId);
    if (!specialty || !specialty.isActive) throw new NotFoundError("Especialidad inválida o inactiva");

    const branch = await this.branchRepo.findById(nuevaCita.branchId);
    if (!branch || !branch.isActive) throw new NotFoundError("Sucursal inválida o inactiva");

    const paciente = await this.patientRepo.findById(nuevaCita.patientId);
    if (!paciente || !paciente.isActive) throw new NotFoundError("Paciente no encontrado o inactivo");

    const status = await this.statusRepo.findById(nuevaCita.statusId);
    if (!status) throw new NotFoundError("Estado de cita no encontrado");

    if (doctor.specialtyId !== nuevaCita.specialtyId) {
       throw new ValidationError("El médico seleccionado no pertenece a la especialidad requerida");
    }

    if (nuevaCita.officeId) {
      const office = await this.officeRepo.findById(nuevaCita.officeId);
      if (!office || !office.isActive) throw new NotFoundError("Consultorio inválido o inactivo");
      if (office.branchId !== nuevaCita.branchId) {
        throw new ValidationError("El consultorio no pertenece a la sucursal seleccionada");
      }
    }

    // --- VALIDACIONES DE DISPONIBILIDAD ---
    const trabajaEseDia = await this.scheduleRepo.findSchedule(
      nuevaCita.doctorId,
      new Date(nuevaCita.startDate).getDay(),
      nuevaCita.startDate,
      nuevaCita.endDate
    );
    if (!trabajaEseDia) throw new ValidationError("El médico no atiende en el horario o sucursal seleccionada");

    if (trabajaEseDia.branchId !== nuevaCita.branchId) {
        throw new ValidationError("El médico atiende en otra sucursal en este horario");
    }

    const estaBloqueado = await this.blockingRepo.findOverlap(
      nuevaCita.doctorId, nuevaCita.startDate, nuevaCita.endDate
    );
    if (estaBloqueado) throw new ConflictError("El médico tiene un bloqueo (descanso/reunión) en este horario");

    const citaSolapada = await this.appointmentRepo.findOverlap(
      nuevaCita.doctorId, nuevaCita.startDate, nuevaCita.endDate
    );
    if (citaSolapada) throw new ConflictError("El médico ya tiene otra cita agendada en este horario");

    const tieneCitaMismoDia = await this.appointmentRepo.findDuplicatePatientAppointment(
      nuevaCita.patientId, nuevaCita.specialtyId, nuevaCita.startDate
    );
    if (tieneCitaMismoDia) throw new ConflictError("El paciente ya cuenta con una cita para esta especialidad el día de hoy");

    return await this.appointmentRepo.create(nuevaCita);
  }
}

module.exports = CrearAppointment;