const SecurityUser = require("../Dominio/Entidades/SecurityUser");
const ConflictError = require("../../../../shared/errors/ConflictError");
class CrearSecurityUser {
  constructor(userRepository, passwordHasher) { this.userRepository = userRepository; this.passwordHasher = passwordHasher; }
  async ejecutar(data) {
    if (await this.userRepository.findByEmail(data.email)) throw new ConflictError("Ya existe un usuario con ese email");
    if (await this.userRepository.findByUsername(data.username)) throw new ConflictError("Ya existe un usuario con ese username");
    const passwordHash = await this.passwordHasher.hash(data.password);
    return await this.userRepository.create(new SecurityUser({ ...data, passwordHash, isActive: true }));
  }
}
module.exports = CrearSecurityUser;
