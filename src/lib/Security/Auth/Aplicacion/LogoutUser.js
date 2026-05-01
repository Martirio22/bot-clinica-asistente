class LogoutUser { constructor(refreshTokenRepository){this.refreshTokenRepository=refreshTokenRepository;} async ejecutar({ refreshToken, userId }){ if(refreshToken) await this.refreshTokenRepository.revoke(refreshToken); else if(userId) await this.refreshTokenRepository.revokeAllByUserId(userId); } }
module.exports = LogoutUser;
