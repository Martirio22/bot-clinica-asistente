const NotFoundError = require("../../../../shared/errors/NotFoundError");
class EliminarSecurityUser { constructor(userRepository){this.userRepository=userRepository;} async ejecutar(id){const u=await this.userRepository.findById(id); if(!u) throw new NotFoundError("Usuario no encontrado"); await this.userRepository.softDelete(id);} }
module.exports = EliminarSecurityUser;
