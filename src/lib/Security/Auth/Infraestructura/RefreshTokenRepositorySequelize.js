const crypto = require("crypto");
const RefreshTokenModel = require("./RefreshTokenModel");
function hashToken(token) { return crypto.createHash("sha256").update(token).digest("hex"); }
class RefreshTokenRepositorySequelize {
  hashToken(token) { return hashToken(token); }
  async save({ userId, refreshToken, ipAddress, userAgent, expiresAt }) {
    const tokenHash = hashToken(refreshToken);
    return await RefreshTokenModel.create({ userId, tokenHash, ipAddress, userAgent, expiresAt, revoked: false });
  }
  async findValidByToken(refreshToken) {
    const tokenHash = hashToken(refreshToken);
    return await RefreshTokenModel.findOne({ where: { tokenHash, revoked: false } });
  }
  async revoke(refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await RefreshTokenModel.update({ revoked: true, revokedAt: new Date() }, { where: { tokenHash } });
  }
  async revokeAllByUserId(userId) {
    await RefreshTokenModel.update({ revoked: true, revokedAt: new Date() }, { where: { userId, revoked: false } });
  }
}
module.exports = RefreshTokenRepositorySequelize;
