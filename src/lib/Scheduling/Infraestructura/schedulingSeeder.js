const AppointmentStatusModel = require("../AppointmentStatus/Infraestructura/AppointmentStatusModel");
const ScheduleBlockTypeModel = require("../ScheduleBlockType/Infraestructura/ScheduleBlockTypeModel");

async function seedScheduling() {

  const statuses = [
    { code: "RESERVADA", name: "Pendiente", description: "Cita reservada" },
    { code: "CONFIRMADA", name: "Confirmada", description: "Cita confirmada por el paciente" },
    { code: "EN_ESPERA", name: "En espera", description: "Cita en espera" },
    { code: "CANCELADA", name: "Cancelada", description: "Cita cancelada" },
    { code: "COMPLETADA", name: "Completada", description: "Cita atendida correctamente" },
    { code: "ATENDIDA", name: "ATENDIDA", description: "La cita ya fue atentida" },
    { code: "NO_ASISTIO", name: "No asistió", description: "El paciente no se presentó" },
    { code: "REPROGRAMADA", name: "Reprogramada", description: "La cita fue reprogramada" },
    { code: "EXPIRADA", name: "Expirada", description: "La cita fue expirada" }
  ];

  for (const status of statuses) {
    await AppointmentStatusModel.findOrCreate({
      where: { code: status.code },
      defaults: status
    });
  }

  const blocks = [
    { code: "VACACION", name: "Vacaciones", description: "Bloqueo por vacaciones" },
    { code: "ALMUERZO", name: "Almuerzo", description: "Horario de almuerzo" },
    { code: "REUNION", name: "Reunión", description: "Reuniones internas" },
    { code: "PERSONAL", name: "Asunto personal", description: "Motivos personales" },
    { code: "MANTENIMIENTO", name: "Mantenimiento", description: "Bloqueo por mantenimiento" }
  ];

  for (const block of blocks) {
    await ScheduleBlockTypeModel.findOrCreate({
      where: { code: block.code },
      defaults: block
    });
  }

  console.log("Seed scheduling ejecutado");
}

module.exports = seedScheduling;