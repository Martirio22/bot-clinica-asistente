const BranchModel = require("../Branches/Infraestructura/BranchModel");
const OfficeModel = require("../Offices/Infraestructura/OfficeModel");

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
}

module.exports = setupClinicAssociations;