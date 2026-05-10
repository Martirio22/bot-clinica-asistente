class ListarUsuariosPorRol {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async ejecutar(roleCode) {
    if (!roleCode) throw new Error("El código del rol es obligatorio");
    return await this.userRepository.findByRoleCode(roleCode);
  }
}

module.exports = ListarUsuariosPorRol;