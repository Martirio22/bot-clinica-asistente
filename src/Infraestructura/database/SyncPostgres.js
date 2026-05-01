const { sequelize } = require("./Postgres");
const setupSecurityAssociations = require("../../lib/Security/Infraestructura/associations");
const seedSecurity = require("../../lib/Security/Infraestructura/securitySeeder");

// Importar modelos para que Sequelize los registre
require("../../lib/Security/Users/Infraestructura/UserModel");
require("../../lib/Security/Roles/Infraestructura/RoleModel");
require("../../lib/Security/UserRoles/Infraestructura/UserRoleModel");
require("../../lib/Security/Auth/Infraestructura/RefreshTokenModel");

async function syncPostgres() {
  setupSecurityAssociations();
  await sequelize.createSchema("security").catch(() => {});
  await sequelize.sync({
    alter: process.env.DB_SYNC_ALTER === "true",
    force: process.env.DB_SYNC_FORCE === "true"
  });
  console.log("Modelos PostgreSQL sincronizados correctamente");
  if (process.env.SEED_SECURITY === "true") await seedSecurity();
}
module.exports = syncPostgres;
