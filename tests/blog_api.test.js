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

describe('When working with an initial collection of blog entries', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})         // clear the collection
    await Blog.insertMany(blogs)      // seed from your imported blogs-list
  })

  test('Notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Verify each post has an id parameter', async () => {
    const response = await api.get('/api/blogs')
    const body = response.body

    // console.log('body:', body) // this is to test the array is fetched

    assert.ok(Array.isArray(body), 'body should be an array')

    body.forEach(post => {
      assert.ok(post.id, `post is missing id: ${JSON.stringify(post)}`)
    })
  })

  test('Verify POST request creates new blog post', () => {
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

  test('Verify Post request creates new post (async/await version)', async () => {
    let blogs_length = 0

    //find the initial number of blogs
    let response = await api.get('/api/blogs')
    let body = response.body
    blogs_length = body.length
    console.log('blogs length:', blogs_length)

    //test adding a blog
    await api.post('/api/blogs').send({
        title: 'Test Post 2',
        author: 'Test Author 2',
        url: 'http://test.com',
        likes: 0
      })

    //verify the number of blogs is added by one
    response = await api.get('/api/blogs')
    console.log('new length:', response.body.length)

    assert.strictEqual(blogs_length + 1, response.body.length)
  })

  test('Verify that when likes is missing on POST it defaults to zero', async () => {
    await api.post('/api/blogs').send({
      title: 'Test Post',
      author: 'Test Author',
      url: 'http://test.com'
    })

    response = await api.get('/api/blogs')
    const body = response.body
    const index = body.length - 1

    // console.log(body)

    assert.strictEqual(body[index].likes, 0)
  })

  test('Verify you get a 400 error if title is missing', async () => {
    const response = await api.post('/api/blogs').send({
      author: 'Tim Grindall',
      url: 'https://blog.timothygrindall.com',
      likes: 5
    })

    console.log(response.status)
    assert.strictEqual(response.status, 400)
  })

  test('Verify you get a 400 error if url is missing', async () => {
    const response = await api.post('/api/blogs').send({
      title: 'The Important Thing',
      author: 'Tim Grindall',
      likes: 5
    })

    console.log(response.status)
    assert.strictEqual(response.status, 400)
  })

  test('Verify blog entry is deleted', async () => {
    const response = await api.get('/api/blogs')
    const body = response.body
    const lastBlog = body[body.length - 1]
    const deletedId = lastBlog.id

    console.log('id:', deletedId)

    await api.delete('/api/blogs/' + deletedId).expect(204)
    updated = await api.get('/api/blogs')

    assert.strictEqual(updated.body.length, body.length - 1)
  })

  test('Verify a blog entry is updated', async () => {
    const response = await api.get('/api/blogs')
    const body = response.body
    const originalEntry = body[body.length - 1]
    const id = originalEntry.id

    const updatedEntry = await api.put('/api/blogs/' + id).send({
      likes: originalEntry.likes + 1
    })

    const baseline = {
      ...originalEntry,
      likes: originalEntry.likes + 1
    }

    assert.deepStrictEqual(baseline, updatedEntry.body)
  })
})

after(async () => {
  await mongoose.connection.close()
})