class IUser {
  /* 
    Crear un nuevo usuario
    @param {string} email -> correo del usuario
    @ param {sting} password -> password del usuario
    @return {Promise<User>}
    @throw {error} si hay una error en la cración
  */
  static async createUser (email, password) {}
  static async findByEmail (email) {}
  async verifyPassword(password) {}
  
}

module.exports = IUser