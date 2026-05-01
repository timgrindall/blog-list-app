const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs-list')

describe('author with most blogs', () => {

const author_winner = 'Robert C. Martin'
const numberOfBlogs = 3
const winner = {
  author: author_winner,
  blogs: numberOfBlogs
}

  test('with a bigger list', () => {
    const result = listHelper.hasMostBlogs(blogs)
    assert.deepStrictEqual(result, winner)
  })

  test('with empty list', () => {
    const result = listHelper.hasMostBlogs([])
    assert.deepStrictEqual(result, null)
  })

})