const AttendanceAuthorization = require("../Dominio/Entidades/AttendanceAuthorization");
const AttendanceAuthorizationModel = require("./AttendanceAuthorizationModel");
const AppointmentModel = require("../../Appointments/Infraestructura/AppointmentModel");
const UserModel = require("../../../Security/Users/Infraestructura/UserModel");

class AARepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new AttendanceAuthorization({
      ...plain,
      appointment: plain.appointment || null,
      authorizedByUser: plain.authorizedByUser || null
    });
  }

  async create(auth) {
    const created = await AttendanceAuthorizationModel.create(auth);
    return this.findById(created.id);
  }

  async findById(id) {
    const data = await AttendanceAuthorizationModel.findByPk(id, {
      include: [
        { model: AppointmentModel, as: "appointment" },
        { model: UserModel, as: "authorizedByUser" }
      ]
    });
    return data ? this.toDomain(data) : null;
  }

  async findByAppointmentId(appointmentId) {
    const data = await AttendanceAuthorizationModel.findOne({ where: { appointmentId } });
    return data ? this.toDomain(data) : null;
  }

  async findAll(filters = {}) {
    const data = await AttendanceAuthorizationModel.findAll({
      where: {...filters, isActive: true},
      include: [
        { model: AppointmentModel, as: "appointment" },
        { model: UserModel, as: "authorizedByUser" }
      ],
    order: [["createdAt", "DESC"]]
    });
    return data.map(d => this.toDomain(d));
  }

  async update(id, data) {
    await AttendanceAuthorizationModel.update(data, { where: { id } });
    return this.findById(id);
  }

  async softDelete(id) {
    await AttendanceAuthorizationModel.update({ isActive: false }, { where: { id } });
  }
}

module.exports = AARepositorySequelize;