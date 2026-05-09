const MedicalAttention = require("../Dominio/Entidades/MedicalAttention");

class ListarMedicalAttentions {
  constructor(attentionRepo) {
    this.attentionRepo = attentionRepo;
  }

  async ejecutar(userIdFromToken) {
    const attentions = await this.attentionRepo.findAllByDoctor(userIdFromToken);
    
    return attentions;
  }
}

module.exports = ListarMedicalAttentions;