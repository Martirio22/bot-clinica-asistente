const NotFoundError = require("../../../../shared/errors/NotFoundError");
class ObtenerSecurityUserPorId { constructor(userRepository){this.userRepository=userRepository;} async ejecutar(id){const u=await this.userRepository.findById(id); if(!u) throw new NotFoundError("Usuario no encontrado"); return u;} }
module.exports = ObtenerSecurityUserPorId;
