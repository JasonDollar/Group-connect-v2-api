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
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})

postSchema.pre(/^find/, function (next) {
  this.populate('createdBy', '_id name')
  this.populate('comments.createdBy', '_id name')
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post