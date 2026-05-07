const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validation checks
  if (name && typeof name !== 'string') {
    logger.error("Error: expected type of `name` to be a string")
    return response.status(400).json({error: 'expected type of `name` to be a string'})
  }

  if (!password || typeof password !== 'string') {
    logger.error('Error: expected type of `password` to be a string')
    return response.status(400).json({error: 'expected type of `password` to be a string'})
  } else if (password.length < 3) {
    logger.error('Error: expected `password` to be at least 3 characters long')
    return response.status(400).json({error: "expected `password` to be at least 3 characters long"})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})

  if (users.length === 0) {
    logger.error('No users found in DB')
    return res.status(200).json([])
  }

  //remove blogs from user info
  usersFormatted = users.map((user) => ({
    username: user.username,
    name: user.name,
    id: user.id
  }))
  // logger.info(usersFormatted)

  logger.info(`${users.length} users found`)
  res.status(200).json(usersFormatted)
})

usersRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  const userDeleted = await User.findByIdAndDelete(id)

  logger.info(userDeleted)
  if (!userDeleted) {
    logger.error('Error: bad id: user not found')
    return res.status(400).json({error: "bad id: user not found"})
  }

  res.status(200).json(userDeleted)
})

module.exports = usersRouter