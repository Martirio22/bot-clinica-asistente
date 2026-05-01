const UnauthorizedError = require("../../../../shared/errors/UnauthorizedError");
function addDays(days){ const d=new Date(); d.setDate(d.getDate()+days); return d; }
class RefreshToken {
  constructor(userRepository, tokenService, refreshTokenRepository) { this.userRepository=userRepository; this.tokenService=tokenService; this.refreshTokenRepository=refreshTokenRepository; }
  async ejecutar({ refreshToken, ipAddress, userAgent }) {
    if(!refreshToken) throw new UnauthorizedError("Refresh token requerido");
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);
    const stored = await this.refreshTokenRepository.findValidByToken(refreshToken);
    if(!stored || stored.expiresAt < new Date()) throw new UnauthorizedError("Refresh token inválido o expirado");
    const user = await this.userRepository.findById(decoded.sub);
    if(!user || !user.canLogin()) throw new UnauthorizedError("Usuario inválido");
    await this.refreshTokenRepository.revoke(refreshToken);
    const roles = (user.roles || []).map(r => r.code);
    const newAccessToken = this.tokenService.generateAccessToken({ sub:user.id, username:user.username, email:user.email, roles });
    const newRefreshToken = this.tokenService.generateRefreshToken({ sub:user.id });
    await this.refreshTokenRepository.save({ userId:user.id, refreshToken:newRefreshToken, ipAddress, userAgent, expiresAt:addDays(7) });
    return { accessToken:newAccessToken, refreshToken:newRefreshToken };
  }
}
module.exports = RefreshToken;
