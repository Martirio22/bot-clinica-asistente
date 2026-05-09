const MedicalPrescription = require("../Dominio/Entidades/MedicalPrescription");
const MedicalPrescriptionModel = require("./MedicalPrescriptionModel");

class MPRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new MedicalPrescription({
      ...plain,
      medicalAttention: plain.medicalAttention || null
    });
  }

  async create(data) {
    const res = await MedicalPrescriptionModel.create(data);
    return this.findById(res.id);
  }

  async findById(id) {
    const data = await MedicalPrescriptionModel.findByPk(id, {
      include: [{ 
        association: "medicalAttention",
        include: ["patient", "doctor"] 
      }]
    });
    return data ? this.toDomain(data) : null;
  }

  async update(id, data) {
    await MedicalPrescriptionModel.update(data, { where: { id } });
    return this.findById(id);
  }
  
 async findAllByDoctor(userId) {
    const data = await MedicalPrescriptionModel.findAll({
      include: [{association: "medicalAttention", required: false,include: ["patient", 
          { association: "doctor",  where: { userId }, required: true}
        ]
      }],
      order: [["issueDate", "DESC"]]
    });
    return data.map(d => this.toDomain(d));
  }
  async findByAttentionId(medicalAttentionId) {
  const data = await MedicalPrescriptionModel.findOne({ 
    where: { medicalAttentionId } 
  });
  return data ? this.toDomain(data) : null;
}

  async softDelete(id) {
    await MedicalPrescriptionModel.update({ isActive: false }, { where: { id } });
  }
}

module.exports = MPRepositorySequelize;