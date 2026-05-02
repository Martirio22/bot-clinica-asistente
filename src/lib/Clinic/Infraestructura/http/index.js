const PasswordHasher = require("../../../../shared/security/PasswordHasher");
const TokenService = require("../../../../shared/security/TokenService");

const BranchRepositorySequelize = require("../../Branches/Infraestructura/BranchRepositorySequelize");
const OfficeRepositorySequelize = require("../../Offices/Infraestructura/OfficeRepositorySequelize");

const CrearBranch = require("../../Branches/Aplicacion/CrearBranch");
const ListarBranch = require("../../Branches/Aplicacion/ListarBranch");
const ObtenerBranchPorId = require("../../Branches/Aplicacion/ObtenerBranchPorId");
const ActualizarBranch = require("../../Branches/Aplicacion/ActualizarBranch");
const EliminarBranch = require("../../Branches/Aplicacion/EliminarBranch");

const CrearOffice = require("../../Offices/Aplicacion/CrearOffice");
const ListarOffice = require("../../Offices/Aplicacion/ListarOffice");
const ObtenerOfficePorId = require("../../Offices/Aplicacion/ObtenerOfficePorId");
const ActualizarOffice = require("../../Offices/Aplicacion/ActualizarOffice");
const EliminarOffice = require("../../Offices/Aplicacion/EliminarOffice");

const BranchController = require("../../Branches/Infraestructura/http/BranchController");
const BranchRoutes = require("../../Branches/Infraestructura/http/BranchRoutes");
const OfficeController = require("../../Offices/Infraestructura/http/OfficeController");
const OfficeRoutes = require("../../Offices/Infraestructura/http/OfficeRoutes");

module.exports = function registerClinicModule(app) {

  const branchRepository = new BranchRepositorySequelize();
  const officeRepository = new OfficeRepositorySequelize();

  const branchController = new BranchController({
    crear: new CrearBranch(branchRepository),
    listar: new ListarBranch(branchRepository),
    obtener: new ObtenerBranchPorId(branchRepository),
    actualizar: new ActualizarBranch(branchRepository),
    eliminar: new EliminarBranch(branchRepository)
  });

  const officeController = new OfficeController({
  crear: new CrearOffice(officeRepository),
  listar: new ListarOffice(officeRepository),
  obtener: new ObtenerOfficePorId(officeRepository),
  actualizar: new ActualizarOffice(officeRepository),
  eliminar: new EliminarOffice(officeRepository)
});

  app.use("/api/clinic/branches", BranchRoutes(branchController));
  app.use("/api/clinic/offices", OfficeRoutes(officeController));
};
