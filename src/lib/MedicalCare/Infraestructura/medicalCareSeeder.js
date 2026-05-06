const AttentionStatusModel = require("../AttentionStatus/Infraestructura/AttentionStatusModel");

async function seedMedicalCare() {

  const statuses = [
    { code: "PENDIENTE", name: "Pendiente", description: "Atención pendiente" },
    { code: "EN_PROCESO", name: "En proceso", description: "Paciente en atención" },
    { code: "FINALIZADO", name: "Finalizado", description: "Atención completada" },
    { code: "CANCELADO", name: "Cancelado", description: "Atención cancelada" }
  ];

  for (const status of statuses) {
    await AttentionStatusModel.findOrCreate({
      where: { code: status.code },
      defaults: status
    });
  }

  console.log("Seed MedicalCare ejecutado");
}

module.exports = seedMedicalCare;