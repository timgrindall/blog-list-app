const blogsRouter = require('express').Router()
const Blog = require('../models/blog') 

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  }).catch(error => {
      console.log(error)
      response.status(404).send({error: "Blogs could not be loaded"})
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  }).catch(error => {
      console.log(error)
      response.status(500).send({error: "Blog could not be saved"})
  })
})

module.exports = blogsRouter