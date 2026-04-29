const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  }).catch(error => {
      logger.error(error)
      response.status(404).send({error: "Blogs could not be loaded"})
  })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  }).catch(error => {
      logger.error(error)
      response.status(500).send({error: "Blog could not be saved"})
  })
})

module.exports = blogsRouter