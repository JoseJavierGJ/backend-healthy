const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('./../config/firebase')

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body 

    // Buscamos el usuario para verificar que exista el correo electronico
    // ahora con firebase-admin solo lo podemos poner asi
    const userDoc = await admin.firestore().collection('users').doc(email).get()

    // Si no existe el usuario
    if (!userDoc.exists) {
      return res.status(404).json({
        massege: 'User not found'
      })
    }

    const userData = userDoc.data()

    // Verificar si el password es correcto
    const isValidPass = await bcrypt.compare(password, userData.password)
    
    if(!isValidPass) {
      return res.status(401).json({
        massege: 'Invalid Credentials'
      })
    }

    // General el TOKEN
    const token = jwt.sign ({ email: userData.email }, process.env.SECRET, { expiresIn: '1h'})
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json ({
      massege: 'Internal Server Error'
    })
  }
}

const registerUser = async (req, res ) => {
  console.log('@@@ body => ', req.body)
  try {
    const { email, password } = req. body
    onsole.log('@@@ email => ', email)
    onsole.log('@@@ pass => ', password)
    // hash password
    const hashed = await bcrypt.hash(password, id)
    onsole.log('@@@ hashed => ', hashed)
    // Guardar en la DB
    await admin.firestore().collection('user').doc(email).set({
      email: email,
      password: hashed
    })

    res.status(201).json({
      massege: 'User registered successfully'
    })
  } catch {
    return res.status(404).json({
      massege: 'User not found'
    })
  }
}

module.exports = { registerUser, loginUser }