const bcrypt = require('bcrypt')
const admin = require('../config/firebase')
const IUser = require('../interfaces/IUser')
const firestore = admin.firestore()
 
class User extends IUser {
  constructor (email, password) {
    super()
    this.email = email
    this.password = password
    // nombre, apaterno, amaterno, direccion, telefono
  }
 
  static async createUser (email, password) {
    try {
      const hash = await bcrypt.hash(password, 10)
      const user = firestore.collection('users').doc(email)
      await user.set({
        email,
        password: hash,
      })
    } catch (error) {
      console.log('Error => ', error )
      throw new Error ('Error creating user')
    }
  }
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password)
  }
  static async findByEmail (email) {
    try {
      const user = firestore.collection('users').doc(email)
      const userDoc = await user.get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        return new User(userData.email, userData.password)
      }
      return null
    } catch (error) {
      console.log('Error => ', error )
      throw new Error ('Error finding user')
    }
  }
 
  static async getAllUsers () {
    try {
      const users = await firestore.collection('users').get()
      const foundUsers = []
      users.forEach(doc => {
        foundUsers.push({
          id: doc.email,
          ...doc.data()
        })
      })
      return foundUsers
    } catch (error) {
      throw error
    }
  }
 
  static async deleteUser (userEmail) {
    try {
      await firestore.collection('users').doc(userEmail).delete()
    } catch (error) {
      throw error
    }
  }
 
  static async updateUser (userEmail, userData) {
    try {
      await firestore.collection('users').doc(userEmail).update(userData)
      const userUpdated = await firestore.collection('users').doc(userEmail).get()
      return {
        userUpdated: userUpdated.data()
      }
    } catch (error) {
      throw error
    }
  }
}
 
module.exports = User