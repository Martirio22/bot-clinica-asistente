const UserRole = require("../Dominio/Entidades/UserRole");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");
class AsignarRoleAUser {
  constructor(userRepository, roleRepository, userRoleRepository) { this.userRepository=userRepository; this.roleRepository=roleRepository; this.userRoleRepository=userRoleRepository; }
  async ejecutar({ userId, roleId }) {
    const user = await this.userRepository.findById(userId); if(!user) throw new NotFoundError("Usuario no encontrado");
    const role = await this.roleRepository.findById(roleId); if(!role) throw new NotFoundError("Rol no encontrado");
    if(!role.canBeAssigned()) throw new ConflictError("El rol está inactivo");
    return await this.userRoleRepository.assign(new UserRole({ userId, roleId, isActive: true }));
  }
}
module.exports = AsignarRoleAUser;
