class RegisterUser { constructor(crearSecurityUser){this.crearSecurityUser=crearSecurityUser;} async ejecutar(data){return await this.crearSecurityUser.ejecutar(data);} }
module.exports = RegisterUser;
