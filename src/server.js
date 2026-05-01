const buildApp = require("./app");
const { connection } = require("./Infraestructura/database/Mongo");
const { connectPostgres } = require("./Infraestructura/database/Postgres");
const syncPostgres = require("./Infraestructura/database/SyncPostgres");

async function start() {
  const port = Number(process.env.PORT) || 3977;

  await connection();
  await connectPostgres();
  await syncPostgres();

  const app = buildApp();
  app.listen(port, () => console.log("Servidor corriendo correctamente en el puerto: " + port));
}

start().catch((e) => {
  console.error("Fallo al iniciar la aplicación:", e);
  process.exit(1);
});
