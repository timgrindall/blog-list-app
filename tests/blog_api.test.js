const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs-list')
const Blog = require('../models/blog') // your Mongoose model

const app = require('../app')
const supertest = require('supertest')
// const { forEach } = require('lodash')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})         // clear the collection
  await Blog.insertMany(blogs)      // seed from your imported blogs-list
})

test.only('Notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('Verify each post has an id parameter', async () => {
  const response = await api.get('/api/blogs')
  const body = response.body

  // console.log('body:', body) // this is to test the array is fetched

  assert.ok(Array.isArray(body), 'body should be an array')

  body.forEach(post => {
    assert.ok(post.id, `post is missing id: ${JSON.stringify(post)}`)
  })
})

test.only('Verify POST request creates new blog post', () => {
  let blogsLength = 0

  //get the current number of blogs
  return api.get('/api/blogs').then( response => {
    const body = response.body
    blogsLength = body.length
  
    console.log('blogs length:', blogsLength)

    //test adding a blog
    return api.post('/api/blogs').send({
      title: 'Test Post',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 0
    }).then(() => {
      console.log('post added')

      return api.get('/api/blogs').then(response => {
        console.log('new length:', response.body.length)
        assert.strictEqual(response.body.length, blogsLength + 1)
      })
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})