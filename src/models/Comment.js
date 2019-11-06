const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
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
    required: [true, 'Comment must belong to an user'],
  },
  createdInPost: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must belong to a post'],
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})

commentSchema.pre(/^find/, function (next) {
  this.populate('createdBy', '_id name')
  next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment