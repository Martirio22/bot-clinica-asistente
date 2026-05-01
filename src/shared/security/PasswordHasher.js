const bcrypt = require("bcrypt");

class PasswordHasher {
  async hash(plainText) {
    return await bcrypt.hash(plainText, 10);
  }

  async compare(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }
}

module.exports = PasswordHasher;
