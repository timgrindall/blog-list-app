const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  blogs = await Blog.find({})
  
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  // console.log('Router: deleting id:', id)

  const deletedBlog = await Blog.findByIdAndDelete(id)
  // console.log('Router: deleted:', deletedBlog)  // null if not found

  res.status(204).json(deletedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const reqBody = req.body
  console.log('Router: id:', id)
  console.log('Router: body:', reqBody)

  const modifiedBlog = await Blog.findByIdAndUpdate(id, reqBody, {new: true})
  console.log('Router: modified:', modifiedBlog)

  res.status(200).json(modifiedBlog) 
})

module.exports = blogsRouter