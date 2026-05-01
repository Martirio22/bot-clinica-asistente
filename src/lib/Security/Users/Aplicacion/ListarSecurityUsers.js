class ListarSecurityUsers { constructor(userRepository){this.userRepository=userRepository;} async ejecutar(){return await this.userRepository.findAll();} }
module.exports = ListarSecurityUsers;
