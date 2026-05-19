const BotMenuOption = require("../Dominio/Entidades/BotMenuOption");
const BotMenuOptionModel = require("./BotMenuOptionModel");

class BMORepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new BotMenuOption({
      id: plain.id,
      menuBotId: plain.menuBotId,
      code: plain.code,
      optionText: plain.optionText,
      action: plain.action,
      targetMenuId: plain.targetMenuId,
      order: plain.order,
      isActive: plain.isActive,
      parentMenu: plain.parentMenu || null,
      targetMenu: plain.targetMenu || null
    });
  }

  async create(option) {
    const created = await BotMenuOptionModel.create({
      menuBotId: option.menuBotId,
      code: option.code,
      optionText: option.optionText,
      action: option.action,
      targetMenuId: option.targetMenuId,
      order: option.order,
      isActive: option.isActive
    });
    return this.findById(created.id);
  }

  async findById(id) {
    const data = await BotMenuOptionModel.findByPk(id, {
      include: [
        { association: "parentMenu" },
        { association: "targetMenu" }
      ]
    });
    return data ? this.toDomain(data) : null;
  }

  async findAllByMenu(menuBotId) {
    const data = await BotMenuOptionModel.findAll({
      where: { menuBotId },
      order: [["order", "DESC"]]
    });
    return data.map(d => this.toDomain(d));
  }

  async findByMenuAndCode(menuBotId, code) {
    const data = await BotMenuOptionModel.findOne({
      where: { menuBotId, code }
    });
    return data ? this.toDomain(data) : null;
  }

  async update(id, data) {
    await BotMenuOptionModel.update(data, { where: { id } });
    return this.findById(id);
  }

  async softDelete(id) {
    await BotMenuOptionModel.update({ isActive: false }, { where: { id } });
  }
}

module.exports = BMORepositorySequelize;