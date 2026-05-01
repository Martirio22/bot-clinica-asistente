const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || "clinica_bot_db",
  username: process.env.POSTGRES_USER || "clinica_user",
  password: process.env.POSTGRES_PASSWORD || "clinica_password",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    underscored: true,
    timestamps: true
  }
});

async function connectPostgres() {
  await sequelize.authenticate();
  console.log("PostgreSQL conectado correctamente");
}

module.exports = { sequelize, connectPostgres };