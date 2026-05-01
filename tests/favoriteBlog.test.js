const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs-list')

describe('most popular blog by likes', () => {

const blogs_winner = blogs[2]

  test('with a bigger list', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs_winner)
  })

  test('with empty list', () => {
    const result = listHelper.favoriteBlog([{},{}])
    assert.deepStrictEqual(result, {})
  })

})