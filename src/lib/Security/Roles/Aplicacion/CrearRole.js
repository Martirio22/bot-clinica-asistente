const Role = require("../Dominio/Entidades/Role");
const ConflictError = require("../../../../shared/errors/ConflictError");
class CrearRole { constructor(roleRepository) { this.roleRepository = roleRepository; } async ejecutar(data) { const role = new Role(data); if (await this.roleRepository.findByCode(role.code)) throw new ConflictError("Ya existe un rol con ese código"); return await this.roleRepository.create(role); } }
module.exports = CrearRole;
