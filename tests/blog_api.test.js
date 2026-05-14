const { test, after, before, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs-list')
const Blog = require('../models/blog') // your Mongoose model
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const app = require('../app')
const supertest = require('supertest')
const blog = require('../models/blog')
// const { forEach } = require('lodash')

const api = supertest(app)

describe('When working with an initial collection of blog entries', () => {
  let testUserId

  before(async () => {
    // create the user once
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash(process.env.SESSION_SECRET, 10)
    const user = new User({ username: 'merelytimo', passwordHash })
    const savedUser = await user.save()
    testUserId = savedUser._id
  })

  beforeEach(async () => {
    await Blog.deleteMany({})         // clear the collection
    const blogsWithUser = blogs.map(blog => ({...blog, user: testUserId}))
    await Blog.insertMany(blogsWithUser)      // seed from your imported blogs-list
  })

  test('Blogs are returned as json', async () => {
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

  // methodology: get all -> count, login -> token, token -> post, get all -> count, compare length

  test.only('Verify POST request creates new blog post', async () => {

    //get the initial count
    let response = await api.get('/api/blogs')
    const blogsLength = response.body.length
    
    console.log('blogs length:', blogsLength)

    // login to get auth token
    const loginResponse = await api.post('/api/login').send({
      username: 'merelytimo',
      password: process.env.SESSION_SECRET
    })
    const token = loginResponse.body.token

      //test adding a blog
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Test Post',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 0
    })
    console.log('post added')

    // compare lengths
    response = await api.get('/api/blogs')
    console.log('new length:', response.body.length)
    assert.strictEqual(response.body.length, blogsLength + 1)
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

  // rewrite this one for delete
  test.only('Verify DELETE request deletes blog entry with same user', async () => {

      // login to get auth token
    const loginResponse = await api.post('/api/login').send({
      username: 'merelytimo',
      password: process.env.SESSION_SECRET
    })
    const token = loginResponse.body.token

    // get blog id
    const response = await api.get('/api/blogs')
    const body = response.body
    const lastBlog = body[body.length - 1]
    const id = lastBlog.id

    console.log('id:', id)

    // test delete
    await api.delete('/api/blogs/' + id)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    
    // get list of blogs
    updatedRes = await api.get('/api/blogs')

    //test length is equal
    assert.strictEqual(updatedRes.body.length, body.length - 1)
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

  test.only('Verify you get a 401 Unauthorized status code when there is no token', async () => {

      //test adding a blog
    const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer xyz`)
    .send({
      title: 'Test Post',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 0
    })
    .expect(401)

    // assert.strictEqual(response.status, 401)
  })
})

after(async () => {
  await mongoose.connection.close()
})