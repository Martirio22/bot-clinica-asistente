const PasswordHasher = require("../../../../shared/security/PasswordHasher");
const TokenService = require("../../../../shared/security/TokenService");

const UserRepositorySequelize = require("../../Users/Infraestructura/UserRepositorySequelize");
const RoleRepositorySequelize = require("../../Roles/Infraestructura/RoleRepositorySequelize");
const UserRoleRepositorySequelize = require("../../UserRoles/Infraestructura/UserRoleRepositorySequelize");
const RefreshTokenRepositorySequelize = require("../../Auth/Infraestructura/RefreshTokenRepositorySequelize");

const CrearSecurityUser = require("../../Users/Aplicacion/CrearSecurityUser");
const ListarSecurityUsers = require("../../Users/Aplicacion/ListarSecurityUsers");
const ObtenerSecurityUserPorId = require("../../Users/Aplicacion/ObtenerSecurityUserPorId");
const ActualizarSecurityUser = require("../../Users/Aplicacion/ActualizarSecurityUser");
const EliminarSecurityUser = require("../../Users/Aplicacion/EliminarSecurityUser");
//se agrega
const ListarUsuariosPorRol = require("../../Users/Aplicacion/ListarUsuariosPorRol");

const CrearRole = require("../../Roles/Aplicacion/CrearRole");
const ListarRoles = require("../../Roles/Aplicacion/ListarRoles");
const ObtenerRolePorId = require("../../Roles/Aplicacion/ObtenerRolePorId");
const ActualizarRole = require("../../Roles/Aplicacion/ActualizarRole");
const EliminarRole = require("../../Roles/Aplicacion/EliminarRole");

const AsignarRoleAUser = require("../../UserRoles/Aplicacion/AsignarRoleAUser");
const ListarUserRoles = require("../../UserRoles/Aplicacion/ListarUserRoles");
const ListarRolesPorUser = require("../../UserRoles/Aplicacion/ListarRolesPorUser");
const RemoverRoleDeUser = require("../../UserRoles/Aplicacion/RemoverRoleDeUser");

const RegisterUser = require("../../Auth/Aplicacion/RegisterUser");
const LoginUser = require("../../Auth/Aplicacion/LoginUser");
const RefreshToken = require("../../Auth/Aplicacion/RefreshToken");
const LogoutUser = require("../../Auth/Aplicacion/LogoutUser");

const AuthController = require("../../Auth/Infraestructura/http/AuthController");
const AuthRoutes = require("../../Auth/Infraestructura/http/AuthRoutes");
const SecurityUserController = require("../../Users/Infraestructura/http/SecurityUserController");
const SecurityUserRoutes = require("../../Users/Infraestructura/http/SecurityUserRoutes");
const RoleController = require("../../Roles/Infraestructura/http/RoleController");
const RoleRoutes = require("../../Roles/Infraestructura/http/RoleRoutes");
const UserRoleController = require("../../UserRoles/Infraestructura/http/UserRoleController");
const UserRoleRoutes = require("../../UserRoles/Infraestructura/http/UserRoleRoutes");

module.exports = function registerSecurityModule(app) {
  const userRepository = new UserRepositorySequelize();
  const roleRepository = new RoleRepositorySequelize();
  const userRoleRepository = new UserRoleRepositorySequelize();
  const refreshTokenRepository = new RefreshTokenRepositorySequelize();
  const passwordHasher = new PasswordHasher();
  const tokenService = new TokenService();

  const crearSecurityUser = new CrearSecurityUser(userRepository, passwordHasher);
  const obtenerSecurityUserPorId = new ObtenerSecurityUserPorId(userRepository);

  const authController = new AuthController({
    registerUser: new RegisterUser(crearSecurityUser),
    loginUser: new LoginUser(userRepository, passwordHasher, tokenService, refreshTokenRepository),
    refreshToken: new RefreshToken(userRepository, tokenService, refreshTokenRepository),
    logoutUser: new LogoutUser(refreshTokenRepository),
    obtenerSecurityUserPorId
  });

  const userController = new SecurityUserController({
    crear: crearSecurityUser,
    listar: new ListarSecurityUsers(userRepository),
    obtener: obtenerSecurityUserPorId,
    actualizar: new ActualizarSecurityUser(userRepository),
    eliminar: new EliminarSecurityUser(userRepository),
    //se agrega
    listarPorRol: new ListarUsuariosPorRol(userRepository)
  });

  const roleController = new RoleController({
    crear: new CrearRole(roleRepository),
    listar: new ListarRoles(roleRepository),
    obtener: new ObtenerRolePorId(roleRepository),
    actualizar: new ActualizarRole(roleRepository),
    eliminar: new EliminarRole(roleRepository)
  });

  const userRoleController = new UserRoleController({
    asignar: new AsignarRoleAUser(userRepository, roleRepository, userRoleRepository),
    listar: new ListarUserRoles(userRoleRepository),
    listarRolesPorUser: new ListarRolesPorUser(userRoleRepository),
    remover: new RemoverRoleDeUser(userRoleRepository)
  });

  app.use("/api/security/auth", AuthRoutes(authController));
  app.use("/api/security/users", SecurityUserRoutes(userController));
  app.use("/api/security/roles", RoleRoutes(roleController));
  app.use("/api/security/user-roles", UserRoleRoutes(userRoleController));
};
