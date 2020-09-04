const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')


require('dotenv').config({path:'../.env'});
const JWT_SECRET = process.env.JWT_SECRET


router.post('/registration', 
[
  check('email', 'Incorrect Email').isEmail(),  // clean data
  check('login', 'Incorrect Login (4-12 symbols required)').isLength({ min: 4 , max: 12}),
  check('password', 'Incorrect Password (min 4 symbols required)').isLength({ min: 4 })
],
async (req, res) => {

  try {
    // array of validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: ''
      })
    }

    const {login, email, password, rpassword} = req.body

    if (password !==rpassword) {
      res.status(400).json({ message: 'Passwords do not match'})
    }

    // looking for already existing User with choosen login or email
    const exEmail = await User.findOne({ email })
    const exLogin = await User.findOne({ login })
    if (exEmail) {
      res.status(400).json({ message: 'User with that email already exist'})
    }
    if (exLogin) {
      res.status(400).json({ message: 'User with that login already exist'})
    }

    // hash password for security and create user
    const hashedPassword = await bcrypt.hash(password, 4)
    const user = new User ({ email, login, password: hashedPassword})
    await user.save()
    res.status(201).json({ message: 'User has been created'})
    
  } catch (e) {
    res.status(500).json({message: 'Ooops! Internal server error'})
  }
})

router.post('/login',
[
  check('password', 'Password could not be empty').exists()
],
async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: ''
      })
    }

    const {login, password} = req.body

    // Looking for user
    var user = await User.findOne({ login: login })
    if (!user) {
      return res.status(400).json({ message: 'Incorrect login or password'})
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect login or password'})
    }

    // set Token in localStorage for Auth
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '24h'}
    )

    res.status(200).json({ token, userId: user.id })

  } catch {
      res.status(500).json({message: 'Ooops! Internal server error'})
    }
})

router.get('/test', 
async (req, res) => {
  return res.status(200).json({ message: 'Kuku Hello'})
})


module.exports = router