class ListarRoles { constructor(roleRepository){this.roleRepository=roleRepository;} async ejecutar(){return await this.roleRepository.findAll();} }
module.exports = ListarRoles;