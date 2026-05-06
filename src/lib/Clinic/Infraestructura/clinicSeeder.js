const SpecialtyModel = require("../Specialties/Infraestructura/SpecialtyModel");

async function seedClinic() {

  const specialties = [
    { code: "GENERAL", name: "Medicina General", description: "Atención médica general" },
    { code: "PEDIATRIA", name: "Pediatría", description: "Atención a niños" },
    { code: "GINECOLOGIA", name: "Ginecología", description: "Salud femenina" },
    { code: "CARDIOLOGIA", name: "Cardiología", description: "Especialidad del corazón" },
    { code: "DERMATOLOGIA", name: "Dermatología", description: "Enfermedades de la piel" }
  ];

  for (const specialty of specialties) {
    await SpecialtyModel.findOrCreate({
      where: { code: specialty.code },
      defaults: specialty
    });
  }

  console.log("Seed de clinica ejecutado");
}

module.exports = seedClinic;