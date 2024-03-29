const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticateToken = (req, res, next) => {
  const token = req.headers['authotization']

  if (!token) {
    return res.status(401).json ({
      massage: 'Unauthorized'
    })
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken