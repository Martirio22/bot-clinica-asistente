const BotMenu = require("../Dominio/Entidades/BotMenu");
const BotMenuModel = require("./BotMenuModel");

class BotMenuRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new BotMenu({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      message: plain.message,
      isMainMenu: plain.isMainMenu,
      isActive: plain.isActive
    });
  }

  async create(menu) {
    const created = await BotMenuModel.create({
      code: menu.code,
      name: menu.name,
      message: menu.message,
      isMainMenu: menu.isMainMenu,
      isActive: menu.isActive
    });
    return this.toDomain(created);
  }

  async findById(id) {
    const menu = await BotMenuModel.findByPk(id);
    return menu ? this.toDomain(menu) : null;
  }

  async findAll() {
    const menus = await BotMenuModel.findAll({
      where: { isActive: true }
    });
    return menus.map(m => this.toDomain(m));
  }

  async update(id, data) {
    await BotMenuModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await BotMenuModel.update({ isActive: false }, { where: { id } });
  }

  async findByCode(code) {
    const menu = await BotMenuModel.findOne({
      where: { code: code.toUpperCase() }
    });
    return menu ? this.toDomain(menu) : null;
  }

  async findMainMenu() {
    const menu = await BotMenuModel.findOne({
      where: { isMainMenu: true, isActive: true }
    });
    return menu ? this.toDomain(menu) : null;
  }
}

module.exports = BotMenuRepositorySequelize;