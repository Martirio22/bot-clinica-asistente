class SecurityUser {
  constructor({ id, firstName, lastName, email, username, passwordHash, phone = null, isActive = true, roles = [] }) {
    if (!firstName) throw new Error("nombres requeridos");
    if (!lastName) throw new Error("apellidos requeridos");
    if (!email) throw new Error("email requerido");
    if (!username) throw new Error("username requerido");

    this.id = id;
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.email = email.trim().toLowerCase();
    this.username = username.trim();
    this.passwordHash = passwordHash;
    this.phone = phone;
    this.isActive = isActive;
    this.roles = roles;
  }

  canLogin() { return this.isActive === true; }
}
module.exports = SecurityUser;
