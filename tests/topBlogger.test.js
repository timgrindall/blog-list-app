const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs-list')

describe('author with most likes', () => {

  // result: { author: 'Edsger W. Dijkstra', likes: 17 }
  const winner = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }

  test('with a bigger list', () => {
    const result = listHelper.bloggerByLikes(blogs)
    assert.deepStrictEqual(result, winner)
  })

  test('with empty list', () => {
    const result = listHelper.bloggerByLikes([])
    assert.strictEqual(result, null)
  })

})