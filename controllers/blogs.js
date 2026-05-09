const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const { ObjectId } = require('mongodb')

blogsRouter.get('/', async (request, response) => {
  blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  
  logger.info(blogs)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.findOne({})

  // Verify not empty
  if (!user) {
    return response.status(400).json({ error: 'no users found' });
  }

  // save the new blog with user id
  const blog = new Blog({...request.body, user: user._id})
  const savedBlog = await blog.save()

  //save the new blog to the user
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()   // we don't save the returned doc

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  // console.log('Router: deleting id:', id)

  const deletedBlog = await Blog.findByIdAndDelete(id)
  if (!deletedBlog) {
    res.status(404).send({error: "document not found"})
  }

  // console.log(deletedBlog)
  res.status(200).json(deletedBlog) // should prob be 204 for "no content"
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