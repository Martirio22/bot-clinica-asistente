const express = require("express");
const cors = require("cors");
const path = require("path");

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

  // Archivos públicos: PDFs, imágenes, documentos, etc.
  app.use("/public", express.static(path.join(process.cwd(), "public")));

  app.get("/health", (req, res) =>
    res.json({ ok: true, service: "hx-odm-js-clinica" })
  );

  registerSecurityModule(app);
  registerChatBotModule(app);
  registerClinicModule(app);
  registerSchedulingModule(app);
  registerMedicalCareModule(app);
  registerChatBotSqlModule(app);

  app.use((req, res) =>
    res.status(404).json({ success: false, message: "Ruta no encontrada" })
  );

  app.use(errorHandler);

  return app;
}

module.exports = buildApp;