const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Post content is required'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to an user'],
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
  commentsLength: {
    type: Number,
    default: 0,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})

postSchema.pre(/^find/, function (next) {
  this.populate('createdBy', '_id name slug')
  this.populate('comments', '-__v -createdInPost')
  next()
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post