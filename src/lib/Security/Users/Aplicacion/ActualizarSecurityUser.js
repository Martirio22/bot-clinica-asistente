const NotFoundError = require("../../../../shared/errors/NotFoundError");
class ActualizarSecurityUser { constructor(userRepository){this.userRepository=userRepository;} async ejecutar(id,data){const u=await this.userRepository.findById(id); if(!u) throw new NotFoundError("Usuario no encontrado"); return await this.userRepository.update(id,{ firstName:data.firstName??u.firstName, lastName:data.lastName??u.lastName, email:data.email??u.email, username:data.username??u.username, phone:data.phone??u.phone, isActive:data.isActive??u.isActive });} }
module.exports = ActualizarSecurityUser;
