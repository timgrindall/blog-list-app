require('dotenv').config()
// console.log("ENV:", process.env.MONGODB_URI)

const mongoose = require('mongoose')

if (!process.env.MONGODB_URI) {
  console.log('No MONGO_URI ENV variable!')
  process.exit(1)
}

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)