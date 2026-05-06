const BranchModel = require("../Branches/Infraestructura/BranchModel");
const OfficeModel = require("../Offices/Infraestructura/OfficeModel");
const DoctorModel = require("../Doctors/Infraestructura/DoctorModel");
const SecurityUserModel = require("../../Security/Users/Infraestructura/UserModel");
const SpecialtyModel = require("../Specialties/Infraestructura/SpecialtyModel");
const ClinicalAssistantModel = require("../ClinicalAssistants/Infraestructura/ClinicalAssistantModel");

function setupClinicAssociations() {
  BranchModel.hasMany(OfficeModel, {
    foreignKey: "branchId",
    as: "offices"
  });

  OfficeModel.belongsTo(BranchModel, {
    foreignKey: "branchId",
    as: "branch"
  });

  console.log("BRANCH MODEL ID:", BranchModel === require("../Branches/Infraestructura/BranchModel"));

   DoctorModel.belongsTo(SecurityUserModel, {
    foreignKey: "userId",
    as: "user"
  });

  DoctorModel.belongsTo(SpecialtyModel, {
    foreignKey: "specialtyId",
    as: "specialty"
  });

  ClinicalAssistantModel.belongsTo(SecurityUserModel, {
  foreignKey: "userId",
  as: "user"
});
}

module.exports = setupClinicAssociations;