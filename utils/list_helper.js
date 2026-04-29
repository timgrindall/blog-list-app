const countBy = require('lodash/countBy');
const maxBy = require('lodash/maxBy');
const sumBy = require('lodash/sumBy');
const _filter = require('lodash/filter');

const dummy = (blogs) => {
  
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0

  blogs.forEach(blog => {
    if (blog.likes >= 0) {
      likes = blog.likes + likes
    } else return 0
  });

  return likes
}

const favoriteBlog = (blogs) => {
  let highestScore = 0
  let winner = {}

  blogs.forEach((blog) => {
    if (blog.likes >= highestScore) {
      winner = blog
      highestScore = blog.likes
    }
  })

  return winner
}

const hasMostBlogs = (blogs) => {
  if (!blogs.length) return null;

  const authorCounts = countBy(blogs, 'author');
  const topAuthor = maxBy(Object.keys(authorCounts), author => authorCounts[author]);

  const result = { author: topAuthor, blogs: authorCounts[topAuthor] };
  // { author: "Robert C. Martin", blogs: 3 }
  return result;
}

/*
Define a function called mostLikes that receives an array of blogs as its parameter. The function returns the author whose blog posts have the largest amount of likes. The return value also contains the total number of likes that the author has received:
*/

const bloggerByLikes = (blogs) => {
  if (!blogs.length) return null;

  const authors = [...new Set(blogs.map(blog => blog.author))];

  const authorLikes = authors.map(author => ({
    author,
    likes: sumBy(_filter(blogs, { author }), 'likes')
  }));

  return maxBy(authorLikes, 'likes');
}

module.exports = {
  bloggerByLikes,
  hasMostBlogs,
  favoriteBlog,
  totalLikes,
  dummy
}