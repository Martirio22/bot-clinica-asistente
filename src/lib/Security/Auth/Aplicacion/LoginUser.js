const UnauthorizedError = require("../../../../shared/errors/UnauthorizedError");
function addDays(days){ const d=new Date(); d.setDate(d.getDate()+days); return d; }
class LoginUser {
  constructor(userRepository, passwordHasher, tokenService, refreshTokenRepository) { this.userRepository=userRepository; this.passwordHasher=passwordHasher; this.tokenService=tokenService; this.refreshTokenRepository=refreshTokenRepository; }
  async ejecutar({ usernameOrEmail, password, ipAddress, userAgent }) {
    const user = await this.userRepository.findByUsernameOrEmail(usernameOrEmail);
    if(!user || !user.canLogin()) throw new UnauthorizedError("Credenciales inválidas");
    const ok = await this.passwordHasher.compare(password, user.passwordHash);
    if(!ok) throw new UnauthorizedError("Credenciales inválidas");
    const roles = (user.roles || []).map(r => r.code);
    const accessToken = this.tokenService.generateAccessToken({ sub: user.id, username: user.username, email: user.email, roles });
    const refreshToken = this.tokenService.generateRefreshToken({ sub: user.id });
    await this.refreshTokenRepository.save({ userId:user.id, refreshToken, ipAddress, userAgent, expiresAt:addDays(7) });
    return { accessToken, refreshToken, user: { id:user.id, firstName:user.firstName, lastName:user.lastName, email:user.email, username:user.username, roles } };
  }
}
module.exports = LoginUser;
