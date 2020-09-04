const jwt = require('jsonwebtoken')

require('dotenv').config({path:'../.env'});
const JWT_SECRET = process.env.JWT_SECRET

module.exports = (req, res, next) => {

  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: 'Not Authorized!' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()

  } catch {
    res.status(401).json({ message: 'Not Authorized!' })
  }
}