const express = require("express");
const cors = require("cors");
const registerSecurityModule = require("./lib/Security/Infraestructura/http");
const registerChatBotModule = require("./lib/ChatBot/Infraestructura/http");
const registerClinicModule = require("./lib/Clinic/Infraestructura/http");
const registerSchedulingModule = require("./lib/Scheduling/Infraestructura/http");
const registerMedicalCareModule = require("./lib/MedicalCare/Infraestructura/http");
const registerChatBotSqlModule = require("./lib/ChatBotSql/Infraestructura/http");
const errorHandler = require("./shared/middlewares/errorHandler");

function buildApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) =>
    res.json({ ok: true, service: "hx-odm-js-clinica" })
  );

  // Módulos reales del sistema según el modelo enviado.
  registerSecurityModule(app);   // users, roles, user_roles, auth, refresh_tokens
  registerChatBotModule(app);    // chat_messages, webhooks, logs de entrega
  registerClinicModule(app);     // branches, doctors, offices, patients, specialties, assistants
  registerSchedulingModule(app); // appointments, schedule, authorizations, status
  registerMedicalCareModule(app);
  registerChatBotSqlModule(app);

  app.use((req, res) =>
    res.status(404).json({ success: false, message: "Ruta no encontrada" })
  );

  app.use(errorHandler);

  return app;
}

module.exports = buildApp;
