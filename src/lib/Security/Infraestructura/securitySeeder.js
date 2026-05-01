const RoleModel = require("../Roles/Infraestructura/RoleModel");
async function seedSecurity() {
  const roles = [
    { code: "ADMIN", name: "Administrador", description: "Administra el sistema." },
    { code: "MEDICO", name: "Médico", description: "Gestiona agenda y atención médica." },
    { code: "ASISTENTE", name: "Asistente Clínico", description: "Gestiona chats y citas." },
    { code: "ENFERMERO", name: "Enfermero", description: "Apoya procesos clínicos." }
  ];
  for (const role of roles) {
    await RoleModel.findOrCreate({ where: { code: role.code }, defaults: role });
  }
  console.log("Seed de seguridad ejecutado");
}
module.exports = seedSecurity;
