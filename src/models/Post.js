const mongoose = require('mongoose')

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

const Post = mongoose.model('Post', postSchema)

module.exports = Post