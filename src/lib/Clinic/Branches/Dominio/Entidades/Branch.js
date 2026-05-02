class Branch {
  constructor({id, name, address, city, phone = null, latitude = null, longitude = null, isActive = true}) {
    if (!name) throw new Error("nombre requerido");
    if (!address) throw new Error("direccion requerida");
    if (!city) throw new Error("ciudad requerida");

    this.id = id;
    this.name = name.trim();
    this.address = address.trim();
    this.city = city.trim();
    this.phone = phone;
    this.latitude = latitude;
    this.longitude = longitude;
    this.isActive = isActive;
  }
}

module.exports = Branch;