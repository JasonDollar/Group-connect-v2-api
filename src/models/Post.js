const mongoose = require('mongoose')
// const Comment = require('./Comment')

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Post content is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to an user'],
  },
  createdInGroup: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
    required: [true, 'Post must belong to a group'],
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

// postSchema.virtual('commentsLength').get(async function () {
//   const count = await Comment.countDocuments({ createdInPost: this._id })
//   console.log(count)
//   return count
// })

const Post = mongoose.model('Post', postSchema)

module.exports = Post